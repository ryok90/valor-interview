/**
 * Represents a coding challenge available for download
 */
export interface Challenge {
  /** The name of the challenge (e.g., "rspack-mf-react") */
  readonly name: string;
  /** The relative path to the challenge within the repository */
  readonly path: string;
  /** Optional description of the challenge */
  readonly description?: string;
}

/**
 * Configuration options for copying challenge files
 */
export interface CopyOptions {
  /** Source directory path */
  readonly source: string;
  /** Destination directory path */
  readonly destination: string;
  /** Whether to overwrite existing files (default: true) */
  readonly overwrite?: boolean;
}

/**
 * Supported package managers for dependency installation
 */
export type PackageManager = 'pnpm' | 'npm' | 'yarn';

/**
 * Configuration options for installing dependencies
 */
export interface InstallOptions {
  /** Working directory where package.json is located */
  readonly cwd: string;
  /** Package manager to use (defaults to auto-detection) */
  readonly packageManager?: PackageManager;
}

/**
 * GitHub repository information parsed from URL
 */
export interface GitHubRepoInfo {
  /** Repository owner/organization */
  readonly owner: string;
  /** Repository name */
  readonly repo: string;
  /** Git branch */
  readonly branch: string;
}

/**
 * GitHub API response item for repository contents
 */
export interface GitHubApiItem {
  /** Item name */
  readonly name: string;
  /** Item type */
  readonly type: 'file' | 'dir';
  /** Download URL (for files) */
  readonly download_url?: string;
}

/**
 * Command execution options
 */
export interface CommandOptions {
  /** Working directory for command execution */
  readonly cwd?: string;
  /** Stdio configuration */
  readonly stdio?: 'pipe' | 'inherit';
}
