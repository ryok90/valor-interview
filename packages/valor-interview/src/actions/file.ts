import pkg from 'fs-extra';
const { readdir, stat, copy, remove, pathExists } = pkg;
import { join, resolve } from 'path';
import ora from 'ora';
import type { Challenge, CopyOptions } from '../types.js';
import { CONFIG } from '../config.js';
import { fetchChallengesFromAPI, isGitHubRepository } from './api.js';

/**
 * Gets the challenges directory path within a cloned repository
 * @param repoPath - Root path of the cloned repository
 * @returns Full path to the challenges directory
 */
export const getChallengesDirectory = (repoPath: string): string =>
  join(repoPath, CONFIG.PATHS.CHALLENGES_DIR);

/**
 * Scans for challenges using GitHub API (fast, no cloning required)
 * @param repoUrl - GitHub repository URL
 * @returns Array of available challenges
 * @throws {Error} If the repository is not a GitHub repository
 */
export const scanChallengesFromAPI = async (
  repoUrl: string,
): Promise<Challenge[]> => {
  if (!isGitHubRepository(repoUrl)) {
    throw new Error('API scanning only supports GitHub repositories');
  }

  return await fetchChallengesFromAPI(repoUrl, CONFIG.PATHS.CHALLENGES_DIR);
};

/**
 * Scans for challenges from filesystem (requires cloned repository)
 * @param challengesDir - Path to the challenges directory
 * @returns Array of available challenges
 * @throws {Error} If the challenges directory doesn't exist
 */
export const scanChallengesFromFilesystem = async (
  challengesDir: string,
): Promise<Challenge[]> => {
  if (!(await pathExists(challengesDir))) {
    throw new Error(`Challenges directory not found: ${challengesDir}`);
  }

  const items = await readdir(challengesDir);

  const challengePromises = items.map(async (item) => {
    const itemPath = join(challengesDir, item);
    const stats = await stat(itemPath);

    if (stats.isDirectory()) {
      return {
        name: item,
        path: itemPath,
      } as Challenge;
    }
    return null;
  });

  const results = await Promise.all(challengePromises);
  return results.filter(
    (challenge): challenge is Challenge => challenge !== null,
  );
};

/**
 * Scans for available challenges (GitHub API preferred)
 * @param repoUrl - Repository URL
 * @returns Array of available challenges
 * @throws {Error} If the repository is not supported
 */
export const scanChallenges = async (repoUrl: string): Promise<Challenge[]> => {
  if (!isGitHubRepository(repoUrl)) {
    throw new Error(
      'Only GitHub repositories are supported for challenge scanning',
    );
  }

  return await scanChallengesFromAPI(repoUrl);
};

/**
 * Copies a challenge to the specified destination
 * @param options - Copy configuration options
 * @returns Path to the copied challenge
 * @throws {Error} If the copy operation fails
 */
export const copyChallenge = async ({
  source,
  destination,
  overwrite = true,
}: CopyOptions): Promise<string> => {
  const spinner = ora('Copying challenge files...').start();

  try {
    if (overwrite && (await pathExists(destination))) {
      await remove(destination);
    }

    const copyFilter = CONFIG.FEATURES.FILTER_NODE_MODULES
      ? (src: string) => !src.includes('node_modules')
      : undefined;

    await copy(source, destination, {
      overwrite,
      filter: copyFilter,
    });

    spinner.succeed(`Challenge copied to: ${destination}`);
    return destination;
  } catch (error) {
    spinner.fail('Failed to copy challenge');
    throw error;
  }
};

/**
 * Validates if a path string is not empty
 * @param path - Path string to validate
 * @returns True if the path is valid (not empty)
 */
export const validatePath = (path: string): boolean => {
  return Boolean(path?.trim());
};

/**
 * Resolves a path string to an absolute path
 * @param path - Path string to resolve
 * @returns Absolute path (defaults to current working directory if empty)
 */
export const resolvePath = (path: string): string => {
  return resolve(path.trim() || process.cwd());
};
