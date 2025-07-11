import { spawn } from 'child_process';
import ora from 'ora';
import type {
  InstallOptions,
  PackageManager,
  CommandOptions,
} from '../types.js';

/**
 * Executes a command in a child process
 * @param command - Command to execute
 * @param args - Command arguments
 * @param options - Execution options
 * @returns Promise that resolves when command completes successfully
 * @throws {Error} If the command fails
 */
export const runCommand = (
  command: string,
  args: string[],
  options: CommandOptions = {},
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      cwd: options.cwd,
      stdio: options.stdio || 'pipe',
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command '${command} ${args.join(' ')}' failed with exit code ${code}`,
          ),
        );
      }
    });

    childProcess.on('error', (error) => {
      reject(
        new Error(`Failed to execute command '${command}': ${error.message}`),
      );
    });
  });
};

/**
 * Installs dependencies using the specified package manager
 * @param options - Installation options
 * @throws {Error} If the installation fails
 */
export const installDependencies = async ({
  cwd,
  packageManager = 'pnpm',
}: InstallOptions): Promise<void> => {
  const spinner = ora(
    `Installing dependencies with ${packageManager}...`,
  ).start();

  try {
    await runCommand(packageManager, ['install'], { cwd });
    spinner.succeed('Dependencies installed successfully');
  } catch (error) {
    spinner.fail(`Failed to install dependencies with ${packageManager}`);
    throw error;
  }
};

/**
 * Checks if a package manager is available on the system
 * @param packageManager - Package manager to check
 * @returns True if the package manager is available
 */
export const checkPackageManagerAvailable = async (
  packageManager: string,
): Promise<boolean> => {
  try {
    await runCommand(packageManager, ['--version']);
    return true;
  } catch {
    return false;
  }
};

/**
 * Detects the best available package manager on the system
 * Priority order: pnpm > yarn > npm
 * @returns The best available package manager
 */
export const detectPackageManager = async (): Promise<PackageManager> => {
  const managers: PackageManager[] = ['pnpm', 'yarn', 'npm'];

  for (const manager of managers) {
    if (await checkPackageManagerAvailable(manager)) {
      return manager;
    }
  }

  // This should never happen as npm is usually always available
  return 'npm';
};
