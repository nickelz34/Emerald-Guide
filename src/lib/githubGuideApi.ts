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

function contentsUrl(config: GitHubConfig, withRef: boolean): string {
  const base = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
  return withRef ? `${base}?ref=${encodeURIComponent(config.branch)}` : base;
}

function authHeaders(token: string, withContentType = false): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
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
    let detail = response.statusText;
    try {
      const err = (await response.json()) as { message?: string };
      if (err.message) detail = err.message;
    } catch {
      /* ignore */
    }
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

/**
 * Commits the freshly edited guide data back to GitHub.
 */
export async function commitGuideToGitHub(
  config: GitHubConfig,
  updatedData: GuideFilePayload,
): Promise<boolean> {
  if (!currentFileSha) {
    throw new Error("Cannot update file without existing file SHA");
  }

  const jsonString = JSON.stringify(updatedData, null, 2) + "\n";
  const encodedContent = encodeBase64Utf8(jsonString);

  const body = {
    message: "cms: update guide data via admin panel",
    content: encodedContent,
    sha: currentFileSha,
    branch: config.branch,
  };

  const response = await fetch(contentsUrl(config, false), {
    method: "PUT",
    headers: authHeaders(config.token, true),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errorDetails = (await response.json()) as { message?: string };
      console.error("GitHub API Error:", errorDetails);
      if (errorDetails.message) detail = errorDetails.message;
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to commit updates to GitHub (${response.status}): ${detail}`);
  }

  const result = (await response.json()) as { content?: { sha?: string } };
  if (result.content?.sha) currentFileSha = result.content.sha;
  return true;
}
