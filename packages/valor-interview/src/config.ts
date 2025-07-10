/**
 * Application configuration constants
 * All values are set at build time and cannot be changed at runtime
 */
export const CONFIG = {
  /**
   * GitHub repository URL containing challenges
   */
  CHALLENGES_REPO_URL: 'https://github.com/ryok90/valor-interview.git',

  /**
   * Directory structure within the repository
   */
  PATHS: {
    /** Directory containing challenges within the repository */
    CHALLENGES_DIR: 'challenges',
    /** Prefix for temporary directories */
    TEMP_DIR_PREFIX: 'valor-challenges-',
  },

  /**
   * Git configuration
   */
  GIT: {
    /** Default branch to clone */
    DEFAULT_BRANCH: 'main',
    /** Maximum clone depth for performance */
    CLONE_DEPTH: 1,
  },

  /**
   * GitHub API configuration
   */
  GITHUB: {
    /** Base URL for GitHub API */
    API_BASE: 'https://api.github.com',
    /** Base URL for raw file content */
    RAW_BASE: 'https://raw.githubusercontent.com',
  },

  /**
   * Performance and feature flags
   */
  FEATURES: {
    /** Enable sparse checkout for better performance */
    USE_SPARSE_CHECKOUT: true,
    /** Filter out node_modules during file operations */
    FILTER_NODE_MODULES: true,
  },
} as const;

/**
 * Derived configuration values
 */
export const DERIVED_CONFIG = {
  /** Full GitHub API URL for the configured repository */
  get REPO_API_URL() {
    const match = CONFIG.CHALLENGES_REPO_URL.match(
      /github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/,
    );
    if (!match) return null;

    const [, owner, repo] = match;
    return `${CONFIG.GITHUB.API_BASE}/repos/${owner}/${repo}`;
  },
} as const;
