import inquirer from 'inquirer';
import type { Challenge } from '../types.js';
import { validatePath, resolvePath } from './file.js';

/**
 * Prompts the user to select a challenge from the available options
 * @param challenges - Array of available challenges
 * @returns The selected challenge
 * @throws {Error} If no challenges are provided
 */
export const promptChallengeSelection = async (
  challenges: Challenge[],
): Promise<Challenge> => {
  if (challenges.length === 0) {
    throw new Error('No challenges available for selection');
  }

  const { selectedChallenge } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedChallenge',
      message: 'Which challenge would you like to download?',
      choices: challenges.map((challenge) => ({
        name: `${challenge.name}${challenge.description ? ` - ${challenge.description}` : ''}`,
        value: challenge,
        short: challenge.name,
      })),
      pageSize: Math.min(challenges.length, 10),
    },
  ]);

  return selectedChallenge;
};

/**
 * Prompts the user for the destination path where the challenge should be copied
 * @returns The resolved destination path
 */
export const promptDestinationPath = async (): Promise<string> => {
  const { destinationPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'destinationPath',
      message:
        'Where would you like to copy the challenge? (Press Enter for current directory)',
      default: process.cwd(),
      validate: (input: string) => {
        if (!validatePath(input)) {
          return 'Please provide a valid path';
        }
        return true;
      },
      filter: resolvePath,
    },
  ]);

  return destinationPath;
};

/**
 * Prompts the user whether to install dependencies after copying the challenge
 * @returns True if the user wants to install dependencies
 */
export const promptInstallDependencies = async (): Promise<boolean> => {
  const { installDeps } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Would you like to install dependencies?',
      default: true,
    },
  ]);

  return installDeps;
};

/**
 * Prompts the user for confirmation before overwriting an existing directory
 * @param path - The path that would be overwritten
 * @returns True if the user confirms the overwrite
 */
export const promptOverwriteConfirmation = async (
  path: string,
): Promise<boolean> => {
  const { overwrite } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${path} already exists. Overwrite?`,
      default: false,
    },
  ]);

  return overwrite;
};
