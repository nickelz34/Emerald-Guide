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

export interface RepoTextFile {
  path: string;
  content: string;
}

export interface CommitGuideResult {
  mode: "direct" | "pull-request";
  prUrl?: string;
  prNumber?: number;
  version?: string;
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

function contentsUrl(config: GitHubConfig, path: string, ref?: string): string {
  const base = `${apiBase(config)}/contents/${path}`;
  return ref ? `${base}?ref=${encodeURIComponent(ref)}` : base;
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

async function fetchCommitTreeSha(config: GitHubConfig, commitSha: string): Promise<string> {
  const response = await fetch(`${apiBase(config)}/git/commits/${commitSha}`, {
    headers: authHeaders(config.token),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to read commit ${commitSha.slice(0, 7)} (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { tree?: { sha?: string } };
  const treeSha = data.tree?.sha;
  if (!treeSha) throw new Error("Commit is missing a tree SHA");
  return treeSha;
}

async function createBlob(config: GitHubConfig, content: string): Promise<string> {
  const response = await fetch(`${apiBase(config)}/git/blobs`, {
    method: "POST",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({ content, encoding: "utf-8" }),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to create git blob (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { sha?: string };
  if (!data.sha) throw new Error("GitHub blob response missing SHA");
  return data.sha;
}

async function createTree(
  config: GitHubConfig,
  baseTreeSha: string,
  files: Array<{ path: string; sha: string }>,
): Promise<string> {
  const response = await fetch(`${apiBase(config)}/git/trees`, {
    method: "POST",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: files.map((file) => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: file.sha,
      })),
    }),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to create git tree (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { sha?: string };
  if (!data.sha) throw new Error("GitHub tree response missing SHA");
  return data.sha;
}

async function createCommit(
  config: GitHubConfig,
  message: string,
  treeSha: string,
  parentSha: string,
): Promise<string> {
  const response = await fetch(`${apiBase(config)}/git/commits`, {
    method: "POST",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: [parentSha],
    }),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to create git commit (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { sha?: string };
  if (!data.sha) throw new Error("GitHub commit response missing SHA");
  return data.sha;
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

async function updateBranchRef(
  config: GitHubConfig,
  branch: string,
  commitSha: string,
): Promise<{ ok: boolean; status: number; detail: string }> {
  const response = await fetch(`${apiBase(config)}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({ sha: commitSha, force: false }),
  });
  if (response.ok) return { ok: true, status: response.status, detail: "" };
  return {
    ok: false,
    status: response.status,
    detail: await readErrorDetail(response),
  };
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

async function mergePullRequest(
  config: GitHubConfig,
  prNumber: number,
  commitTitle: string,
): Promise<void> {
  const response = await fetch(`${apiBase(config)}/pulls/${prNumber}/merge`, {
    method: "PUT",
    headers: authHeaders(config.token, true),
    body: JSON.stringify({
      commit_title: commitTitle,
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
 * Create a single commit that updates one or more text files on top of a parent commit.
 */
export async function createCommitWithFiles(
  config: GitHubConfig,
  parentCommitSha: string,
  message: string,
  files: RepoTextFile[],
): Promise<string> {
  if (files.length === 0) throw new Error("No files to commit");
  const baseTreeSha = await fetchCommitTreeSha(config, parentCommitSha);
  const blobs = await Promise.all(
    files.map(async (file) => ({
      path: file.path,
      sha: await createBlob(config, file.content),
    })),
  );
  const treeSha = await createTree(config, baseTreeSha, blobs);
  return createCommit(config, message, treeSha, parentCommitSha);
}

async function refreshGuideFileSha(config: GitHubConfig): Promise<string> {
  const response = await fetch(contentsUrl(config, config.path, config.branch), {
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

/** Fetch a UTF-8 text file from the configured branch. */
export async function fetchRepoTextFile(
  config: GitHubConfig,
  path: string,
  ref = config.branch,
): Promise<string> {
  const response = await fetch(contentsUrl(config, path, ref), {
    headers: authHeaders(config.token),
  });
  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(`Failed to fetch ${path} (${response.status}): ${detail}`);
  }
  const data = (await response.json()) as { content?: string; encoding?: string; sha?: string };
  if (!data.content) throw new Error(`GitHub response missing content for ${path}`);
  if (path === config.path && data.sha) currentFileSha = data.sha;
  return decodeBase64Utf8(data.content);
}

/**
 * Fetches the latest guide data and its SHA directly from GitHub.
 */
export async function fetchGuideFromGitHub(
  config: GitHubConfig,
): Promise<GuideFilePayload> {
  const response = await fetch(contentsUrl(config, config.path, config.branch), {
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

async function publishCommitViaPullRequest(
  config: GitHubConfig,
  commitSha: string,
  title: string,
  body: string,
): Promise<CommitGuideResult> {
  const branchName = `cms/guide-data-${Date.now().toString(36)}`;
  await createBranch(config, branchName, commitSha);

  let pullRequestOpened = false;
  try {
    const pr = await createPullRequest(config, branchName, title, body);
    pullRequestOpened = true;

    try {
      await mergePullRequest(config, pr.number, title);
    } catch (err) {
      const hint = err instanceof Error ? err.message : "Merge failed";
      throw new Error(`${hint} PR: ${pr.htmlUrl}`);
    }

    await deleteBranch(config, branchName);
    await refreshGuideFileSha(config);
    return { mode: "pull-request", prUrl: pr.htmlUrl, prNumber: pr.number };
  } catch (err) {
    if (!pullRequestOpened) {
      await deleteBranch(config, branchName);
    }
    throw err;
  }
}

export interface PublishGuideOptions {
  updatedData: GuideFilePayload;
  /** Extra release files (changelog, package.json, README, …). */
  files?: RepoTextFile[];
  commitTitle: string;
  commitBody?: string;
  version?: string;
}

/**
 * Commits guide data (+ optional release files) back to GitHub.
 * Uses the Git Data API for a single multi-file commit, then updates the branch
 * ref directly or via a short-lived PR when rules require it.
 */
export async function commitGuideToGitHub(
  config: GitHubConfig,
  options: PublishGuideOptions,
): Promise<CommitGuideResult> {
  const guideContent = serializeGuidePayload(options.updatedData);
  const files: RepoTextFile[] = [
    { path: config.path, content: guideContent },
    ...(options.files ?? []),
  ];

  const parentSha = await fetchBranchHeadSha(config);
  const message = options.commitBody
    ? `${options.commitTitle}\n\n${options.commitBody}`
    : options.commitTitle;

  const commitSha = await createCommitWithFiles(config, parentSha, message, files);

  const direct = await updateBranchRef(config, config.branch, commitSha);
  if (direct.ok) {
    await refreshGuideFileSha(config);
    return { mode: "direct", version: options.version };
  }

  // Protected branches often reject direct ref updates with 409/422 + a PR-required message.
  if (
    isPullRequestRequiredError(direct.detail) ||
    direct.status === 422 ||
    direct.status === 409
  ) {
    const result = await publishCommitViaPullRequest(
      config,
      commitSha,
      options.commitTitle,
      options.commitBody ??
        [
          "Automated Admin Mode publish.",
          "",
          "Updates guide data and release metadata (version, changelog, README).",
        ].join("\n"),
    );
    return { ...result, version: options.version };
  }

  throw new Error(
    `Failed to update branch “${config.branch}” (${direct.status}): ${direct.detail}`,
  );
}
