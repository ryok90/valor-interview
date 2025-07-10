# Valor Challenges CLI

A CLI tool for downloading and setting up Valor interview challenges.

## Installation

```bash
npm install -g @valor/challenges
# or use with npx
npx @valor/challenges
```

## Usage

```bash
valor-challenges
# or
npx @valor/challenges
```

The CLI will:

1. Clone the challenges repository
2. Present a list of available challenges
3. Allow you to select a challenge
4. Copy it to your desired location
5. Optionally install dependencies

## Development

```bash
# Install dependencies
pnpm install

# Run in development (uses default demo repo)
pnpm dev

# Build for production
REPO_URL=https://github.com/your-org/challenges.git pnpm build

# Clean build artifacts
pnpm clean
```

## Repository Structure

The challenges repository should have this structure:

```
challenges/
├── challenge-1/
│   ├── package.json
│   ├── src/
│   └── ...
├── challenge-2/
│   ├── package.json
│   ├── src/
│   └── ...
└── ...
```

## Environment Variables

- `REPO_URL` (required at build time): Git repository URL containing challenges
