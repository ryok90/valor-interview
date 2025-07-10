# Valor Challenges CLI

A CLI tool for downloading and setting up Valor interview challenges.

## Usage

```bash
npx @valor/interview
```

The CLI will:

1. Present a list of available challenges
2. Allow you to select a challenge
3. Copy it to your desired location
4. Optionally install dependencies

## Development

```bash
# Install dependencies
pnpm install

# Run in development (uses default demo repo)
pnpm dev

# Build
pnpm build

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
