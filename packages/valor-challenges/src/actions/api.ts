import type { Challenge, GitHubRepoInfo, GitHubApiItem } from '../types.js';
import { CONFIG } from '../config.js';

/**
 * Custom error class for GitHub API related errors
 */
export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: Response
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

/**
 * Parses a GitHub repository URL to extract owner, repo, and branch information
 * @param repoUrl - The GitHub repository URL
 * @returns Repository information
 * @throws {Error} If the URL is not a valid GitHub repository URL
 */
export const parseGitHubUrl = (repoUrl: string): GitHubRepoInfo => {
  const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/);
  if (!match) {
    throw new Error(`Invalid GitHub repository URL: ${repoUrl}`);
  }
  
  return {
    owner: match[1],
    repo: match[2],
    branch: CONFIG.GIT.DEFAULT_BRANCH,
  };
};

/**
 * Fetches challenges from GitHub API
 * @param repoUrl - The GitHub repository URL
 * @param challengesDir - Directory containing challenges (default: from config)
 * @returns Array of available challenges
 * @throws {GitHubApiError} If the API request fails
 */
export const fetchChallengesFromAPI = async (
  repoUrl: string,
  challengesDir: string = CONFIG.PATHS.CHALLENGES_DIR,
): Promise<Challenge[]> => {
  const { owner, repo, branch } = parseGitHubUrl(repoUrl);
  const apiUrl = `${CONFIG.GITHUB.API_BASE}/repos/${owner}/${repo}/contents/${challengesDir}?ref=${branch}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new GitHubApiError(
          `Challenges directory '${challengesDir}' not found in repository`,
          404,
          response,
        );
      }
      throw new GitHubApiError(
        `GitHub API request failed: ${response.status} ${response.statusText}`,
        response.status,
        response,
      );
    }

    const data: GitHubApiItem[] = await response.json();

    const challenges: Challenge[] = data
      .filter(
        (item): item is GitHubApiItem & { type: 'dir' } => item.type === 'dir',
      )
      .map((item) => ({
        name: item.name,
        path: `${challengesDir}/${item.name}`,
        description: `Challenge: ${item.name}`,
      }));

    return challenges;
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }

    throw new GitHubApiError(
      `Failed to fetch challenges from GitHub API: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Checks if a repository URL is a GitHub repository
 * @param repoUrl - The repository URL to check
 * @returns True if the URL is a GitHub repository
 */
export const isGitHubRepository = (repoUrl: string): boolean => {
  return /github\.com[/:]/.test(repoUrl);
};

/**
 * Generates a raw file URL for a GitHub repository
 * @param repoUrl - The GitHub repository URL
 * @param filePath - Path to the file within the repository
 * @param branch - Git branch (default: from config)
 * @returns Raw file URL
 */
export const getRawFileUrl = (
  repoUrl: string,
  filePath: string,
  branch: string = CONFIG.GIT.DEFAULT_BRANCH,
): string => {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  return `${CONFIG.GITHUB.RAW_BASE}/${owner}/${repo}/${branch}/${filePath}`;
};