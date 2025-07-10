#!/usr/bin/env node

import { join } from 'path';
import { scanChallenges, copyChallenge } from './actions/file.js';
import {
  promptChallengeSelection,
  promptDestinationPath,
  promptInstallDependencies,
} from './actions/prompts.js';
import { installDependencies, detectPackageManager } from './actions/process.js';
import {
  logHeader,
  logWarning,
  logError,
  logCompletion,
} from './actions/logger.js';
import { withSpecificFolder } from './actions/git.js';
import { CONFIG } from './config.js';
import { GitHubApiError } from './actions/api.js';

/**
 * Main CLI execution function
 * Orchestrates the entire challenge download and setup process
 */
const main = async (): Promise<void> => {
  logHeader();

  try {
    const repoUrl = CONFIG.CHALLENGES_REPO_URL;

    // Step 1: Fetch available challenges from GitHub API
    const challenges = await scanChallenges(repoUrl);

    if (challenges.length === 0) {
      logWarning('No challenges found in the repository.');
      return;
    }

    // Step 2: User selects challenge and destination
    const selectedChallenge = await promptChallengeSelection(challenges);
    const destinationPath = await promptDestinationPath();
    const challengeDestination = join(destinationPath, selectedChallenge.name);

    // Step 3: Clone only the selected challenge using sparse checkout
    await withSpecificFolder(
      repoUrl,
      selectedChallenge.path,
      async (sourcePath: string) => {
        await copyChallenge({
          source: sourcePath,
          destination: challengeDestination,
          overwrite: true,
        });
      },
    );

    // Step 4: Optional dependency installation
    const shouldInstallDeps = await promptInstallDependencies();

    if (shouldInstallDeps) {
      const packageManager = await detectPackageManager();
      await installDependencies({
        cwd: challengeDestination,
        packageManager,
      });
    }

    logCompletion(challengeDestination, shouldInstallDeps);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Handles different types of errors with appropriate messaging
 * @param error - The error that occurred
 */
const handleError = (error: unknown): void => {
  if (error instanceof GitHubApiError) {
    if (error.statusCode === 404) {
      logError(
        'Repository or challenges directory not found. Please check the repository URL and ensure it contains a "challenges" directory.',
      );
    } else if (error.statusCode === 403) {
      logError(
        'Access denied to the repository. Please check if the repository is public or if you have access.',
      );
    } else {
      logError('Failed to fetch challenges from GitHub API', error);
    }
  } else if (error instanceof Error) {
    logError('Failed to setup challenge', error);
  } else {
    logError('An unexpected error occurred', error);
  }

  process.exit(1);
};

// Execute main function with global error handling
main().catch(handleError);
