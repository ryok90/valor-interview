import { mkdtemp, remove } from 'fs-extra';
import { join } from 'path';
import { tmpdir } from 'os';
import ora from 'ora';
import { runCommand } from './process';
import { CONFIG } from '../config';

/**
 * Creates a temporary directory with the configured prefix
 * @returns Path to the created temporary directory
 */
export const createTempDirectory = async (): Promise<string> => {
  const tempDir = await mkdtemp(join(tmpdir(), CONFIG.PATHS.TEMP_DIR_PREFIX));
  return tempDir;
};

/**
 * Clones a git repository to the specified destination
 * @param repoUrl - Repository URL to clone
 * @param destination - Destination directory path
 * @param branch - Git branch to clone (defaults to config)
 * @throws {Error} If the clone operation fails
 */
export const cloneRepository = async (
  repoUrl: string,
  destination: string,
  branch: string = CONFIG.GIT.DEFAULT_BRANCH,
): Promise<void> => {
  const spinner = ora(`Cloning repository...`).start();

  try {
    await runCommand('git', [
      'clone',
      '--depth',
      String(CONFIG.GIT.CLONE_DEPTH),
      '--branch',
      branch,
      repoUrl,
      destination,
    ]);

    spinner.succeed('Repository cloned successfully');
  } catch (error) {
    spinner.fail('Failed to clone repository');
    throw new Error(
      `Git clone failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Safely removes a temporary directory
 * @param tempDir - Path to the temporary directory to remove
 */
export const cleanupTempDirectory = async (tempDir: string): Promise<void> => {
  try {
    await remove(tempDir);
  } catch (error) {
    console.warn(
      `Warning: Failed to cleanup temporary directory ${tempDir}:`,
      error instanceof Error ? error.message : String(error),
    );
  }
};

/**
 * Clones only a specific folder from a repository using sparse checkout
 * @param repoUrl - Repository URL to clone from
 * @param destination - Destination directory path
 * @param folderPath - Specific folder path to clone
 * @param branch - Git branch to clone (defaults to config)
 * @throws {Error} If the sparse checkout operation fails
 */
export const cloneSpecificFolder = async (
  repoUrl: string,
  destination: string,
  folderPath: string,
  branch: string = CONFIG.GIT.DEFAULT_BRANCH,
): Promise<void> => {
  const spinner = ora(`Cloning challenge: ${folderPath}...`).start();

  try {
    // Initialize empty git repo
    await runCommand('git', ['init'], { cwd: destination });

    // Add remote
    await runCommand('git', ['remote', 'add', 'origin', repoUrl], {
      cwd: destination,
    });

    // Configure sparse checkout
    await runCommand('git', ['config', 'core.sparseCheckout', 'true'], {
      cwd: destination,
    });

    // Set sparse checkout path
    await runCommand(
      'sh',
      ['-c', `echo "${folderPath}/*" > .git/info/sparse-checkout`],
      {
        cwd: destination,
      },
    );

    // Pull only the specific folder
    await runCommand(
      'git',
      ['pull', 'origin', branch, '--depth', String(CONFIG.GIT.CLONE_DEPTH)],
      { cwd: destination },
    );

    spinner.succeed(`Challenge cloned: ${folderPath}`);
  } catch (error) {
    spinner.fail('Failed to clone challenge');
    throw new Error(
      `Sparse checkout failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Executes an operation with a temporary full repository clone
 * @param repoUrl - Repository URL to clone
 * @param operation - Operation to perform with the cloned repository
 * @param branch - Git branch to clone (optional)
 * @returns Result of the operation
 */
export const withTempRepository = async <T>(
  repoUrl: string,
  operation: (repoPath: string) => Promise<T>,
  branch?: string,
): Promise<T> => {
  const tempDir = await createTempDirectory();

  try {
    await cloneRepository(repoUrl, tempDir, branch);
    return await operation(tempDir);
  } finally {
    await cleanupTempDirectory(tempDir);
  }
};

/**
 * Executes an operation with a specific folder cloned using sparse checkout
 * @param repoUrl - Repository URL to clone from
 * @param folderPath - Specific folder path to clone
 * @param operation - Operation to perform with the cloned folder
 * @param branch - Git branch to clone (optional)
 * @returns Result of the operation
 */
export const withSpecificFolder = async <T>(
  repoUrl: string,
  folderPath: string,
  operation: (folderPath: string) => Promise<T>,
  branch?: string,
): Promise<T> => {
  const tempDir = await createTempDirectory();

  try {
    await cloneSpecificFolder(repoUrl, tempDir, folderPath, branch);
    const actualFolderPath = join(tempDir, folderPath);
    return await operation(actualFolderPath);
  } finally {
    await cleanupTempDirectory(tempDir);
  }
};

/**
 * Initializes a git repository in the specified directory
 * Handles errors gracefully and logs warnings instead of throwing
 * @param destinationPath - Path where the git repository should be initialized
 */
export const initializeGitRepository = async (
  destinationPath: string,
): Promise<void> => {
  const spinner = ora('Initializing git repository...').start();

  try {
    await runCommand('git', ['init'], { cwd: destinationPath });
    await runCommand('git', ['add', '.'], { cwd: destinationPath });
    await runCommand('git', ['commit', '-m', 'Initial commit'], {
      cwd: destinationPath,
    });

    spinner.succeed('Git repository initialized successfully');
  } catch (error) {
    spinner.fail('Failed to initialize git repository');
    console.warn(
      'Warning: Failed to initialize git repository. You may need to set up git manually.',
    );
  }
};
