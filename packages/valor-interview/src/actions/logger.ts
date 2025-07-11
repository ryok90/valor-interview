import chalk from 'chalk';

/**
 * Logs the CLI header with title and description
 */
export const logHeader = (): void => {
  console.log(chalk.blue.bold('🎯 Valor Challenges CLI'));
  console.log(chalk.gray('Download and setup interview challenges\n'));
};

/**
 * Logs a success message in green with checkmark emoji
 * @param message - The success message to display
 */
export const logSuccess = (message: string): void => {
  console.log(chalk.green.bold(`✅ ${message}`));
};

/**
 * Logs an informational message in gray with folder emoji
 * @param message - The informational message to display
 */
export const logInfo = (message: string): void => {
  console.log(chalk.gray(`📁 ${message}`));
};

/**
 * Logs a warning message in yellow with warning emoji
 * @param message - The warning message to display
 */
export const logWarning = (message: string): void => {
  console.log(chalk.yellow(`⚠️  ${message}`));
};

/**
 * Logs an error message in red with error emoji
 * @param message - The error message to display
 * @param error - Optional error object or additional details
 */
export const logError = (message: string, error?: unknown): void => {
  console.error(chalk.red('❌ Error:'), message);
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(errorMessage));
  }
};

/**
 * Logs the completion status of challenge setup
 * @param challengePath - Path where the challenge was copied
 * @param depsInstalled - Whether dependencies were installed
 */
export const logCompletion = (
  challengePath: string,
  depsInstalled: boolean,
): void => {
  logSuccess('Challenge setup complete!');
  logInfo(`Challenge location: ${challengePath}`);

  if (depsInstalled) {
    console.log(chalk.gray('🎉 Dependencies installed and ready to go!'));
  } else {
    console.log(
      chalk.gray(
        "💡 Don't forget to run `pnpm install` in the challenge directory",
      ),
    );
  }
};
