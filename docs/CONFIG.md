# Configuration

This configuration is intended for experienced developers who want to create a project from scratch with a configuration similar to `trustnet-engine`. To contribute, please follow the guidelines outlined in the [CONTRIBUTING.md](https://github.com/spacetimewave/trustnet-engine/blob/main/CONTRIBUTING.md) file.

### Technologies

The following technologies were used to create `trustnet-engine`.

| Technology               | Feature                     |
| ------------------------ | --------------------------- |
| NodeJS                   | JavaScript runtime          |
| pnpm                     | Package manager             |
| Vite                     | Package bundler             |
| Typescript               | Programming language        |
| vite-plugin-dts          | Declaration Types Generator |
| rollup-plugin-visualizer | Bundle Size Visualizer      |
| ESLint                   | Code linting                |
| Prettier                 | Code formatting             |
| Jest                     | Code Testing                |
| Git                      | Version Control             |
| GitHub                   | Cloud-based git repository  |
| Husky                    | Pre-commit hook validator   |
| lint-staged              | Linting only staged files   |
| commitlint               | Lint git commit messages    |

### Configuration

These are the steps to follow to configure the technologies used by `trustnet-engine`.

1.  Install NodeJS v16.x.x or greater

2.  Install pnpm with NodeJS v16.x.x or greater.

    ```console
    $ corepack enable
    $ corepack prepare pnpm@latest --activate
    ```

3.  Create the project with Vite

    ```console
    $ pnpm create vite <app>
    > Select a framework: Vanilla
    > Select a variant: TypeScript

    $ cd <app>
    $ pnpm install
    $ pnpm update
    ```

4.  Create a new git repository

    ```console
    $ git init
    $ git switch -c main
    ```

5.  Authenticate with GitHub using SSH (step 4.1) or Github CLI (step 4.2):

    4.1. Generate a SSH key, and add it to SSH and GitHub.

    4.2. Login directly using GitHub CLI, `gh login` makes all this magic, saving an encrypted SSH key for us to push commits.

    ```console
    $ gh auth login
    ? What account do you want to log into? GitHub.com
    ? What is your preferred protocol for Git operations on this host? SSH
    ? Generate a new SSH key to add to your GitHub account? Yes
    ? Enter a passphrase for your new SSH key (Optional) ****************
    ? Title for your SSH key: github
    ? How would you like to authenticate GitHub CLI? Login with a web browser
    ```

6.  Create a new GitHub repository and add the origin remote repository

    ```console
    git remote add origin <github-repository>
    ```

7.  Install Prettier formatter as development dependency.

    ```console
    $ pnpm add -D prettier
    ```

8.  Add `prettierrc.json` configuration and `.prettierignore`

9.  If you use VSCode IDE, install `Prettier - Code formatter` extension. Then, add to _.vscode/settings.json_ the following settings to set Prettier as default formater when saving files.

    ```console
    {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
    ```

10. Install ESLint linter as development dependency.

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

11. Install `eslint-config-prettier` to turn-off eslint rules that are unnecessary or might conflict with Prettier. Install `eslint-config-prettier` to run Prettier as an Eslint-rule.

    ```console
    $ pnpm add -D eslint-config-prettier eslint-plugin-prettier
    ```

12. Add unit tests. We will need to install the following development dependencies.

    ```console
    $ pnpm add -D jest @types/jest ts-jest ts-node
    ```

    | Package     | Purpose                                       |
    | ----------- | --------------------------------------------- |
    | jest        | Test runner                                   |
    | ts-jest     | For running jest in typescript supported app. |
    | ts-node     | For creating jest config file in TS extension |
    | @types/jest | Types library for Jest                        |

    Add `jest.config.ts` file with the testing configuration. And finally add your test-suite to the project.

13. Add commit lint and pre-commit hooks.

    ```console
    pnpm add -D @commitlint/cli @commitlint/config-conventional
    pnpm add -D husky
    pnpm add -D lint-staged
    ```

    Add `.lintstagedrc` file with the linting and formating configuration

14. Install git commit hooks and create a pre-commit hook file

    ```console
    $ pnpm husky init
    ```

    Edit the pre-commit commands inside the `.husky/pre-commit` file. Add lint staged and testing to automatically execute them before commiting changes.

15. Add `.husky/commit-msg` hook to lint commit messages

16. Finally, commit your changes and upload your code to GitHub by executing the following commands or more advanced git commands:

```console
git commit -m "feat(scope): msg"
git push -u origin main
```
