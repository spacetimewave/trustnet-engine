# Trustnet Engine

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/spacetimewave/trustnet-engine/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@spacetimewave/trustnet-engine.svg?style=flat)](https://www.npmjs.com/package/@spacetimewave/trustnet-engine) [![PRs Welcome](https://img.shields.io/badge/Pull%20Requests-Open-brightgreen.svg)](https://github.com/javierhersan/opensource-template/CONTRIBUTING.md)

Welcome to trustnet engine.

## Installation

Install trustnet-engine in your project with the following commands:

#### npm

```console
$ npm i @spacetimewave/trustnet-engine
```

#### pnpm

```console
$ pnpm add @spacetimewave/trustnet-engine
```

## Configuration

Install pnpm with NodeJS v16.x.x or greater.

```console
$ corepack enable
$ corepack prepare pnpm@latest --activate
```

Create the project with Vite

```console
$ pnpm create vite <app>
> Select a framework: Vanilla
> Select a variant: TypeScript

$ cd <app>
$ pnpm install
$ pnpm update
```

Login using GitHub CLI saving an encrypted SSH key to push commits

```console
$ gh auth login
? What account do you want to log into? GitHub.com
? What is your preferred protocol for Git operations on this host? SSH
? Generate a new SSH key to add to your GitHub account? Yes
? Enter a passphrase for your new SSH key (Optional) ****************
? Title for your SSH key: github
? How would you like to authenticate GitHub CLI? Login with a web browser
```

Clone the GitHub repository in your local machine

```console
$ git clone git@github.com:spacetimewave/trustnet-engine.git
```

Install Prettier formatter as development dependency.

```console
$ pnpm add -D prettier
```

Install `Prettier - Code formatter` extension in VSCode.
Add to _.vscode/settings.json_ the following settings.

```console
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Install ESLint linter as development dependency.

```console
$ pnpm create @eslint/config
√ How would you like to use ESLint? · style
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser
√ How would you like to define a style for your project? · guide
√ Which style guide do you want to follow? · standard-with-typescript
√ What format do you want your config file to be in? · JSON

The config that you've selected requires the following dependencies:

eslint-config-standard-with-typescript@latest @typescript-eslint/eslint-plugin@^6.4.0 eslint@^8.0.1 eslint-plugin-import@^2.25.2 eslint-plugin-n@^15.0.0 || ^16.0.0  eslint-plugin-promise@^6.0.0 typescript@*
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · pnpm
```

Install `eslint-config-prettier` to turn-off eslint rules that are unnecessary or might conflict with Prettier. Install `eslint-config-prettier` to run Prettier as an Eslint-rule.

```console
pnpm add -D eslint-config-prettier eslint-plugin-prettier
```

Add unit tests.

```console
pnpm add -D jest @types/jest ts-jest ts-node
```

| Package     | Purpose                                       |
| ----------- | --------------------------------------------- |
| jest        | Test runner                                   |
| ts-jest     | For running jest in typescript supported app. |
| ts-node     | For creating jest config file in TS extension |
| @types/jest | Types library for Jest                        |

Add commit lint and pre-commit hooks.

```console
pnpm add -D @commitlint/cli @commitlint/config-conventional
pnpm add -D husky lint-staged
```

## Build code for deployment

```console
$ pnpm build
$ npm login
$ npm publish --access=public
```

## Technologies

| Feature                   | Technology  |
| ------------------------- | ----------- |
| Package manager           | PNPM        |
| Package bundler           | Vite        |
| Programming language      | Typescript  |
| Basic linting             | ESLint      |
| Code formatting           | Prettier    |
| Testing                   | TS Jest     |
| Pre-commit hook validator | Husky       |
| Linting only staged files | lint-staged |
| Lint git commit messages  | commitlint  |
