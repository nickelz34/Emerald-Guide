import type { GuideSection } from "../types";

export interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  token: string;
}

export interface GuideFilePayload {
  walkthrough: GuideSection[];
}

export interface CommitGuideResult {
  mode: "direct" | "pull-request";
  prUrl?: string;
  prNumber?: number;
}

/** SHA of the guide_data.json blob currently loaded from GitHub (required for updates). */
let currentFileSha: string | null = null;

export function getCurrentFileSha(): string | null {
  return currentFileSha;
}

export function clearCurrentFileSha(): void {
  currentFileSha = null;
}

export function getGitHubConfigFromEnv(token: string): GitHubConfig {
  return {
    owner: import.meta.env.VITE_GITHUB_OWNER || "nickelz34",
    repo: import.meta.env.VITE_GITHUB_REPO || "Emerald-Guide",
    path: import.meta.env.VITE_GUIDE_DATA_PATH || "src/data/guide_data.json",
    branch: import.meta.env.VITE_GITHUB_BRANCH || "main",
    token,
  };
}

function apiBase(config: GitHubConfig): string {
  return `https://api.github.com/repos/${config.owner}/${config.repo}`;
}

function contentsUrl(config: GitHubConfig, withRef: boolean, ref = config.branch): string {
  const base = `${apiBase(config)}/contents/${config.path}`;
  return withRef ? `${base}?ref=${encodeURIComponent(ref)}` : base;
}

function authHeaders(token: string, withContentType = false): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (withContentType) headers["Content-Type"] = "application/json";
  return headers;
}

function decodeBase64Utf8(content: string): string {
  const cleaned = content.replace(/\n/g, "");
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function serializeGuidePayload(updatedData: GuideFilePayload): string {
  return `${JSON.stringify(updatedData, null, 2)}\n`;
}

async function readErrorDetail(response: Response): Promise<string> {
  let detail = response.statusText;
  try {
    const errorDetails = (await response.json()) as { message?: string };
    console.error("GitHub API Error:", errorDetails);
    if (errorDetails.message) detail = errorDetails.message;
  } catch {
    /* ignore */
  }
  return detail;
}

/** True when main (or the target branch) requires changes via pull request. */
export function isPullRequestRequiredError(detail: string): boolean {
  const lower = detail.toLowerCase();
  return (
    lower.includes("pull request") ||
    lower.includes("repository rule violations") ||
    lower.includes("changes must be made through a pull request")
  );
}

async function fetchFileSha(config: GitHubConfig, ref = config.branch): Promise<string> {
  const response = await fetch(contentsUrl(config, true, ref), {
    headers: authHeaders(config.token),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to refresh guide file SHA (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { sha?: string };
  if (!data.sha) throw new Error("GitHub response missing file SHA");
  currentFileSha = data.sha;
  return data.sha;
}

async function fetchBranchHeadSha(config: GitHubConfig, branch = config.branch): Promise<string> {
  const response = await fetch(`${apiBase(config)}/git/ref/heads/${encodeURIComponent(branch)}`, {
    headers: authHeaders(config.token),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to read branch “${branch}” (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { object?: { sha?: string } };
  const sha = data.object?.sha;
  if (!sha) throw new Error(`Branch “${branch}” is missing a commit SHA`);
  return sha;
}

async function createBranch(config: GitHubConfig, branchName: string, fromSha: string): Promise<void> {
  const response = await fetch(`${apiBase(config)}/git/refs`, {
    method: "POST",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: fromSha,
    }),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to create branch “${branchName}” (${response.status}): ${detail}`);
  }
}

async function deleteBranch(config: GitHubConfig, branchName: string): Promise<void> {
  const response = await fetch(
    `${apiBase(config)}/git/refs/heads/${encodeURIComponent(branchName)}`,
    {
      method: "DELETE",
      headers: authHeaders(config.token),
    },
  );
  if (!response.ok && response.status !== 404) {
    const detail = await readErrorDetail(response);
    console.warn(`Could not delete branch “${branchName}”: ${detail}`);
  }
}

interface PutFileResult {
  ok: boolean;
  status: number;
  detail: string;
  contentSha?: string;
}

async function putGuideFile(
  config: GitHubConfig,
  branch: string,
  encodedContent: string,
  sha: string,
  message: string,
): Promise<PutFileResult> {
  const response = await fetch(contentsUrl(config, false), {
    method: "PUT",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      message,
      content: encodedContent,
      sha,
      branch,
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      detail: await readErrorDetail(response),
    };
  }

  const result = (await response.json()) as { content?: { sha?: string } };
  return {
    ok: true,
    status: response.status,
    detail: "",
    contentSha: result.content?.sha,
  };
}

async function createPullRequest(
  config: GitHubConfig,
  head: string,
  title: string,
  body: string,
): Promise<{ number: number; htmlUrl: string }> {
  const response = await fetch(`${apiBase(config)}/pulls`, {
    method: "POST",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      title,
      body,
      head,
      base: config.branch,
    }),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to open publish pull request (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { number?: number; html_url?: string };
  if (!data.number || !data.html_url) {
    throw new Error("GitHub did not return a pull request URL");
  }
  return { number: data.number, htmlUrl: data.html_url };
}

async function mergePullRequest(config: GitHubConfig, prNumber: number): Promise<void> {
  const response = await fetch(`${apiBase(config)}/pulls/${prNumber}/merge`, {
    method: "PUT",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      commit_title: "cms: update guide data via admin panel",
      merge_method: "merge",
    }),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(
      `Opened a publish PR but could not merge it (#${prNumber}, ${response.status}): ${detail}. ` +
        `Merge it on GitHub to finish publishing.`,
    );
  }
}

/**
 * Fetches the latest guide data and its SHA directly from GitHub.
 */
export async function fetchGuideFromGitHub(
  config: GitHubConfig,
): Promise<GuideFilePayload> {
  const response = await fetch(contentsUrl(config, true), {
    headers: authHeaders(config.token),
  });

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    if (response.status === 404) {
      throw new Error(
        `Guide file not found at ${config.path} on branch “${config.branch}” (404). ` +
          `Until Admin Mode is merged, set VITE_GITHUB_BRANCH to your feature branch. ` +
          `A 404 can also mean the PAT lacks Contents access to ${config.owner}/${config.repo}.`,
      );
    }
    throw new Error(`Failed to fetch guide data from GitHub (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as { sha: string; content?: string };
  if (!data.content) throw new Error("GitHub response missing file content");

  currentFileSha = data.sha;

  const decoded = decodeBase64Utf8(data.content);
  const parsed = JSON.parse(decoded) as GuideFilePayload;
  if (!parsed || !Array.isArray(parsed.walkthrough)) {
    throw new Error("guide_data.json must contain a walkthrough array");
  }
  return parsed;
}

async function publishViaPullRequest(
  config: GitHubConfig,
  encodedContent: string,
  message: string,
): Promise<CommitGuideResult> {
  const headSha = await fetchBranchHeadSha(config);
  const branchName = `cms/guide-data-${Date.now().toString(36)}`;
  await createBranch(config, branchName, headSha);

  let pullRequestOpened = false;
  try {
    const fileSha = currentFileSha ?? (await fetchFileSha(config, config.branch));
    const put = await putGuideFile(config, branchName, encodedContent, fileSha, message);
    if (!put.ok) {
      throw new Error(`Failed to commit updates on “${branchName}” (${put.status}): ${put.detail}`);
    }
    if (put.contentSha) currentFileSha = put.contentSha;

    const pr = await createPullRequest(
      config,
      branchName,
      "cms: update guide data via admin panel",
      [
        "Automated Admin Mode publish.",
        "",
        "Updates `src/data/guide_data.json` from the live guide editor.",
        "This PR is opened because the target branch requires changes through a pull request.",
      ].join("\n"),
    );
    pullRequestOpened = true;

    try {
      await mergePullRequest(config, pr.number);
    } catch (err) {
      // Leave the branch + PR for manual merge; surface the URL.
      const hint = err instanceof Error ? err.message : "Merge failed";
      throw new Error(`${hint} PR: ${pr.htmlUrl}`);
    }

    await deleteBranch(config, branchName);
    await fetchFileSha(config, config.branch);

    return { mode: "pull-request", prUrl: pr.htmlUrl, prNumber: pr.number };
  } catch (err) {
    // Only delete the temp branch if we never opened a PR (so nothing is left orphaned
    // without a PR, and we don't delete a PR head the user still needs to merge).
    if (!pullRequestOpened) {
      await deleteBranch(config, branchName);
    }
    throw err;
  }
}

/**
 * Commits the freshly edited guide data back to GitHub.
 * Tries a direct Contents API update first; if branch rules require a PR,
 * opens a short-lived branch, commits, opens a PR, and merges it.
 */
export async function commitGuideToGitHub(
  config: GitHubConfig,
  updatedData: GuideFilePayload,
): Promise<CommitGuideResult> {
  // Always refresh SHA immediately before writing to avoid stale-blob 409s.
  await fetchFileSha(config);

  const jsonString = serializeGuidePayload(updatedData);
  const encodedContent = encodeBase64Utf8(jsonString);
  const message = "cms: update guide data via admin panel";
  const sha = currentFileSha;
  if (!sha) throw new Error("Cannot update file without existing file SHA");

  const direct = await putGuideFile(config, config.branch, encodedContent, sha, message);
  if (direct.ok) {
    if (direct.contentSha) currentFileSha = direct.contentSha;
    return { mode: "direct" };
  }

  if (direct.status === 409 && isPullRequestRequiredError(direct.detail)) {
    return publishViaPullRequest(config, encodedContent, message);
  }

  if (direct.status === 409) {
    // Stale blob SHA — refresh once and retry, then fall back to PR flow if required.
    await fetchFileSha(config);
    const retrySha = currentFileSha;
    if (!retrySha) throw new Error("Cannot update file without existing file SHA");
    const retry = await putGuideFile(config, config.branch, encodedContent, retrySha, message);
    if (retry.ok) {
      if (retry.contentSha) currentFileSha = retry.contentSha;
      return { mode: "direct" };
    }
    if (retry.status === 409 && isPullRequestRequiredError(retry.detail)) {
      return publishViaPullRequest(config, encodedContent, message);
    }
    throw new Error(`Failed to commit updates to GitHub (${retry.status}): ${retry.detail}`);
  }

  throw new Error(`Failed to commit updates to GitHub (${direct.status}): ${direct.detail}`);
}
