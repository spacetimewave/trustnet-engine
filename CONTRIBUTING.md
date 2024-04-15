# How to Contribute

Want to contribute to _trustnet-engine_? There are a few things you need to know.

We wrote a **[contribution guide](https://github.com/spacetimewave/trustnet-engine/blob/main/CONTRIBUTING.md)** to help you get started.

## 1. Open Development

All work on trustnet-engine happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## 2. Versioning

_trustnet-engine_ follows **[semantic versioning](https://semver.org/)**.

We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance.

Every significant change is documented in the [changelog](https://github.com/spacetimewave/trustnet-engine/blob/main/CHANGELOG.md) file.

Learn more about semantic versioning and how we applied it in **[Appendix A](#appendix-a-semantic-versioning)**.

## 3. Branch organization

Submit all changes directly to the main branch. We don't use separate branches for development or for upcoming releases. We do our best to keep main in good shape, with all tests passing.

Code that lands in main must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of main at any time.

## 4. Features

To keep the main branch in a releasable state, breaking changes and experimental features must be gated behind a feature branch.

## 5. Bugs

### 5.1. Where to Find Known Issues

We are using GitHub Issues for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn't already exist.

### 5.2. Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. This [template](https://github.com/spacetimewave/trustnet-engine/blob/main/CONTRIBUTING.md) is a great starting point.

### 5.3. Security Bugs

_trustnet-engine_ has a [bounty program](https://github.com/spacetimewave/trustnet-engine/blob/main/CONTRIBUTING.md) for the safe disclosure of security bugs. With that in mind, please do not file public issues; go through the process outlined on that page.

## 6. How to Get in Touch

- Discussion forums.
- Active community of users on Discord.

## 7. Proposing a Change

If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend filing an issue. This lets us reach an agreement on your proposal before you put significant effort into it.

If you're only fixing a bug, it's fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don't accept that specific fix but want to keep track of the issue.

## 8. Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:

**[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than two weeks, it's fine to take it over but you should still leave a comment.

## 9. Collaboration workflow

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. For API changes we may need to fix our internal uses at the Company, which could cause some delay. We'll do our best to provide updates and feedback throughout the process.

We use GitHub flow as a way to contribute.

1. Fork the GitHub repository.
2. Clone the forked repository in your local machine.
3. Authenticate with GitHub with SSH (step 3.1) or Github CLI (step 3.2):

   3.1. Generate SSH key, and add it to SSH and GitHub.

   3.2. Login directly using GitHub CLI, gh login makes all this magic, saving an encrypted SSH key to push commits.

```console
$ gh auth login
? What account do you want to log into? GitHub.com
? What is your preferred protocol for Git operations on this host? SSH
? Generate a new SSH key to add to your GitHub account? Yes
? Enter a passphrase for your new SSH key (Optional) ****************
? Title for your SSH key: computer
? How would you like to authenticate GitHub CLI? Login with a web browser
```

4. Check your remote origins in your local repository.

```console
$ git remote --verbose
√ origin git@github.com:you/repo.git (fetch)
√ origin git@github.com:you/repo.git (push)
```

5. Add upstream remote.

```console
$ git remote add upstream git@github.com:profile/repo.git
```

6. Check again your remote origins in your local repository.

```console
$ git remote --verbose
√ origin git@github.com:you/repo.git (fetch)
√ origin git@github.com:you/repo.git (push)
√ upstream git@github.com:profile/repo.git (fetch)
√ upstream git@github.com:profile/repo.git (push)
```

7. [IN REVIEW] To syncronize and bring the latest changes to main branch, execute the following commands placed in main branch.

```console
$ # Using git pull
$ git fetch upstream
$ git pull upstream main

$ # Or, using fetch+merge (like "git pull" which is fetch + merge)
$ git fetch upstream
$ git merge upstream/main main

$ # Or, using rebase to replay your local work on top of the fetched branch like a "git pull --rebase"
$ git fetch upstream
$ git rebase upstream/main
```

Then update the forked repository by pushing the changes to the main branch (optional)

```console
$ git branch --set-upstream-to=upstream/main
$ git push -u origin main # Bring the changes to the forked repository in GitHub
```

You can also use --set-upstream-to, so git will pull or push directly from/to the upstream branch without specifying it.

```console
$ git branch --set-upstream-to=upstream/main
$ git pull
```

8. Create a feature or fix branch from main.

```console
$ git switch -c feature/feature_name
$ git switch -c fix/fix_name
```

9. Install NodeJS v16.x.x or greater.

10. Install pnpm with NodeJS v16.x.x or greater.

```console
$ corepack enable
$ corepack prepare pnpm@latest --activate
```

11. Install the project dependencies

```console
$ pnpm install
$ pnpm update
```

9. Make changes to the codebase.
10. Make sure your code lints. The linter will catch most issues that may exist in your code. You can check the status of your code styling by simply running `pnpm lint`. However, there are still some styles that the linter cannot pick up. If you are unsure about something, looking at [standard](https://github.com/standard/standard) style guide will guide you in the right direction.
11. Format your code with prettier. We use an automatic code formatter called Prettier. Run `pnpm format` after making any changes to the code.
12. Write tests if a new functionality is added or a bug has been fixed. This way we can ensure that we don't break your code in the future. Run `pnpm test` to execute them. We require that your pull request contains unit tests for any new functionality. Also ensure the complete test suite passes. To check test coverage run `pnpm test:coverage`.
13. Run `pnpm build` to produce pre-built bundles in build folder, as well as prepare npm packages inside build/packages. If you want to try your changes in your existing project, you may copy the build files into the `/node_modules` folder of the other project and use them instead of the stable version.
14. Commit the changes in the feature branch, following the conventional commit message standard explained in **[Appendix E](#appendix-d-commits)**.

```console
$ git commit -m "message"
```

Or if you have issues you can commit with the `no-verify` flag

```console
$ git commit -m "message" --no-verify
```

15. The commit hooks will be automatically executed when executing the commit message.

16. Push the branch to the forked repository (origin remote). Use one of the following commands.

```console
$ git push --set-upstream origin feature/feature_name
$ git push -u origin feature/feature_name
```

Then the next time you do a git push it will know where to upload that branch

17. If you haven't already, complete the CLA.
18. Make a pull request to the original repository, merging the feature branch from origin to main branch from upstream. Fill the subject and message of the Pull Request. Please, be self-explanatory and concise.

19. The Pull Request is revised by a bot (i.e. Codecov-io). The bot will execute the tests, check the test coverage, lint the code and its commits. All this stuff is run in CI pipeline.

20. Write the Pull Request commit message.

21. Confirm squash and merge Pull Request.

![](/img/pull-request.jpg)

22. Then, another CI Pipeline will check the commit message of the Pull Request.

23. Then the CD pipeline will deploy our code to the npm repository, following the semantic version standard.

- Always mantain main branch synced to start your development with the latest version of the code. To sync the main branch and bring the lastest changes from the original repository to the forked repository, you can sync main branch directly from GitHub or using the following git commands:

  ```console
  $ git fetch upstream main
  $ git pull upstream main
  $ git push -u origin main
  ```

24. If you want to remove the branch after completing the pull request

```console
$ # delete branch locally
$ git branch -d feature/feature_name

$ # delete branch remotely
$ git push origin --delete feature/feature_name
```

## Contributor License Agreement (CLA)

In order to accept your pull request, we need you to submit a CLA. You only need to do this once, so if you've done this for another Spacetime Wave open source project, you're good to go. If you are submitting a pull request for the first time, just let us know that you have completed the CLA and we can cross-check with your GitHub username.

Complete your CLA [here]().

## Request for Comments (RFC)

Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow.

Some changes though are “substantial”, and we ask that these be put through a bit of a design process and produce a consensus among the Spacetime Wave core team.

The “RFC” (request for comments) process is intended to provide a consistent and controlled path for new features to enter the project. You can contribute by visiting the [RFCs repository]().

## License

By contributing to _trustnet-engine_, you agree that your contributions will be licensed under its MIT license.

## Codebase organization

Read the [next section]() to learn how the codebase is organized.

## Appendix A: Semantic Versioning

Given a version number MAJOR.MINOR.PATCH, increment the:

MAJOR version when you make incompatible API changes
MINOR version when you add functionality in a backward compatible manner
PATCH version when you make backward compatible bug fixes
Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

1. A normal version number MUST take the form X.Y.Z where X, Y, and Z are non-negative integers, and MUST NOT contain leading zeroes. X is the major version, Y is the minor version, and Z is the patch version. Each element MUST increase numerically. For instance: 1.9.0 -> 1.10.0 -> 1.11.0.

2. Once a versioned package has been released, the contents of that version MUST NOT be modified. Any modifications MUST be released as a new version.

3. Major version zero (0.y.z) is for initial development. Anything MAY change at any time. The public API SHOULD NOT be considered stable.

4. Version 1.0.0 defines the public API. The way in which the version number is incremented after this release is dependent on this public API and how it changes.

5. Patch version Z (x.y.Z | x > 0) MUST be incremented if only backward compatible bug fixes are introduced. A bug fix is defined as an internal change that fixes incorrect behavior.

6. Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backward compatible functionality is introduced to the public API. It MUST be incremented if any public API functionality is marked as deprecated. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes. Patch version MUST be reset to 0 when minor version is incremented.

7. Major version X (X.y.z | X > 0) MUST be incremented if any backward incompatible changes are introduced to the public API. It MAY also include minor and patch level changes. Patch and minor versions MUST be reset to 0 when major version is incremented.

8. A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following the patch version. Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-]. Identifiers MUST NOT be empty. Numeric identifiers MUST NOT include leading zeroes. Pre-release versions have a lower precedence than the associated normal version. A pre-release version indicates that the version is unstable and might not satisfy the intended compatibility requirements as denoted by its associated normal version. Examples: 1.0.0-alpha, 1.0.0-alpha.1, 1.0.0-0.3.7, 1.0.0-x.7.z.92, 1.0.0-x-y-z.--.

9. Build metadata MAY be denoted by appending a plus sign and a series of dot separated identifiers immediately following the patch or pre-release version. Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-]. Identifiers MUST NOT be empty. Build metadata MUST be ignored when determining version precedence. Thus two versions that differ only in the build metadata, have the same precedence. Examples: 1.0.0-alpha+001, 1.0.0+20130313144700, 1.0.0-beta+exp.sha.5114f85, 1.0.0+21AF26D3----117B344092BD.

10. Precedence refers to how versions are compared to each other when ordered.

10.1. Precedence MUST be calculated by separating the version into major, minor, patch and pre-release identifiers in that order (Build metadata does not figure into precedence).

10.2. Precedence is determined by the first difference when comparing each of these identifiers from left to right as follows: Major, minor, and patch versions are always compared numerically.

Example: 1.0.0 < 2.0.0 < 2.1.0 < 2.1.1.

10.3. When major, minor, and patch are equal, a pre-release version has lower precedence than a normal version:

Example: 1.0.0-alpha < 1.0.0.

10.4. Precedence for two pre-release versions with the same major, minor, and patch version MUST be determined by comparing each dot separated identifier from left to right until a difference is found as follows:

10.4.1. Identifiers consisting of only digits are compared numerically.

10.4.2. Identifiers with letters or hyphens are compared lexically in ASCII sort order.

10.4.3. Numeric identifiers always have lower precedence than non-numeric identifiers.

10.4.4. A larger set of pre-release fields has a higher precedence than a smaller set, if all of the preceding identifiers are equal.

Example: 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0.

**Backus–Naur Form Grammar for Valid SemVer Versions**

```console
<valid semver> ::= <version core>
                 | <version core> "-" <pre-release>
                 | <version core> "+" <build>
                 | <version core> "-" <pre-release> "+" <build>

<version core> ::= <major> "." <minor> "." <patch>

<major> ::= <numeric identifier>

<minor> ::= <numeric identifier>

<patch> ::= <numeric identifier>

<pre-release> ::= <dot-separated pre-release identifiers>

<dot-separated pre-release identifiers> ::= <pre-release identifier>
                                          | <pre-release identifier> "." <dot-separated pre-release identifiers>

<build> ::= <dot-separated build identifiers>

<dot-separated build identifiers> ::= <build identifier>
                                    | <build identifier> "." <dot-separated build identifiers>

<pre-release identifier> ::= <alphanumeric identifier>
                           | <numeric identifier>

<build identifier> ::= <alphanumeric identifier>
                     | <digits>

<alphanumeric identifier> ::= <non-digit>
                            | <non-digit> <identifier characters>
                            | <identifier characters> <non-digit>
                            | <identifier characters> <non-digit> <identifier characters>

<numeric identifier> ::= "0"
                       | <positive digit>
                       | <positive digit> <digits>

<identifier characters> ::= <identifier character>
                          | <identifier character> <identifier characters>

<identifier character> ::= <digit>
                         | <non-digit>

<non-digit> ::= <letter>
              | "-"

<digits> ::= <digit>
           | <digit> <digits>

<digit> ::= "0"
          | <positive digit>

<positive digit> ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

<letter> ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"
           | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T"
           | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d"
           | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n"
           | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x"
           | "y" | "z"

```

**FAQ**

- How should I deal with revisions in the 0.y.z initial development phase?

  - The simplest thing to do is start your initial development release at 0.1.0 and then increment the minor version for each subsequent release.

- How do I know when to release 1.0.0?

  - If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0. If you’re worrying a lot about backward compatibility, you should probably already be 1.0.0.

- Doesn’t this discourage rapid development and fast iteration?

  - Major version zero is all about rapid development. If you’re changing the API every day you should either still be in version 0.y.z or on a separate development branch working on the next major version.

- What do I do if I accidentally release a backward incompatible change as a minor version?

  - As soon as you realize that you’ve broken the Semantic Versioning spec, fix the problem and release a new minor version that corrects the problem and restores backward compatibility. Even under this circumstance, it is unacceptable to modify versioned releases. If it’s appropriate, document the offending version and inform your users of the problem so that they are aware of the offending version.

- What should I do if I update my own dependencies without changing the public API?

  - That would be considered compatible since it does not affect the public API. Software that explicitly depends on the same dependencies as your package should have their own dependency specifications and the author will notice any conflicts. Determining whether the change is a patch level or minor level modification depends on whether you updated your dependencies in order to fix a bug or introduce new functionality. We would usually expect additional code for the latter instance, in which case it’s obviously a minor level increment.

- How should I handle deprecating functionality?

  - Deprecating existing functionality is a normal part of software development and is often required to make forward progress. When you deprecate part of your public API, you should do two things: (1) update your documentation to let users know about the change, (2) issue a new minor release with the deprecation in place. Before you completely remove the functionality in a new major release there should be at least one minor release that contains the deprecation so that users can smoothly transition to the new API.

- Is there a suggested regular expression (RegEx) to check a SemVer string?
  - There are two. One with named groups for those systems that support them (PCRE [Perl Compatible Regular Expressions, i.e. Perl, PHP and R], Python and Go).

See: https://regex101.com/r/Ly7O1x/3/

```console
^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)(?:-(?P<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]_))_))?(?:\+(?P<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)\*))?$
And one with numbered capture groups instead (so cg1 = major, cg2 = minor, cg3 = patch, cg4 = prerelease and cg5 = buildmetadata) that is compatible with ECMA Script (JavaScript), PCRE (Perl Compatible Regular Expressions, i.e. Perl, PHP and R), Python and Go.
```

Upon build / CI these version numbers are being generated. During CD / release components are pushed to a _component repository_ such as Nuget, NPM, Docker Hub where a history of different versions is being kept.

## Appendix B: Semantic Versioning during CI/CD pipelines

CI/CD pipelens calculate the version number automatically based on certain source code repository. The `semver` tool looks at a GIT source control branch and comes up with a _repeatable_ and _unique_ version number based on

- number of commits since last major or minor release
- commit messages
- tags
- branch names

Recommendation is to run semver during your CI process to make each build uniquely identifiable.

## Appendix C: Stages of development

- **Pre-alpha**

Pre-alpha refers to all activities performed during the software project before formal testing. These activities can include requirements analysis, software design, software development, and unit testing. In typical open source development, there are several types of pre-alpha versions. Milestone versions include specific sets of functions and are released as soon as the feature is complete.

- **Alpha**

The alpha phase is the first phase of software testing (alpha is the first letter of the Greek alphabet). In this phase, developers generally test the software using white-box techniques. Additional validation is then performed using black-box or gray-box techniques, by another testing team. Moving to black-box testing inside the organization is known as alpha release.

Alpha software is not thoroughly tested by the developer before it is released to customers. Alpha software may contain serious errors, and any resulting instability could cause crashes or data loss. Alpha software may not contain all of the features that are planned for the final version. In general, external availability of alpha software is uncommon in proprietary software, while open source software often has publicly available alpha versions. The alpha phase usually ends with a feature freeze, indicating that no more features will be added to the software. At this time, the software is said to be feature complete. A beta test is carried out following acceptance testing at the supplier's site (alpha test) and immediately before the general release of the software as a product.

In general, an alpha version or release of a software package intends to do something particular, and mostly does so, yet isn't guaranteed to do so fully.

- **Feature complete**

A feature complete (FC) version of a piece of software has all of its planned or primary features implemented but is not yet final due to bugs, performance or stability issues. This occurs at the end of alpha testing of development.

Usually, a feature-complete software still has to undergo beta testing and bug fixing, as well as performance or stability enhancement before it can go to release candidate, and finally gold status.

- **Beta**

Beta, named after the second letter of the Greek alphabet, is the software development phase following alpha. Software in the beta stage is also known as beta ware. A beta phase generally begins when the software is feature complete but likely to contain several known or unknown bugs. Software in the beta phase will generally have many more bugs in it than completed software and speed or performance issues, and may still cause crashes or data loss. The focus of beta testing is reducing impacts on users, often incorporating usability testing. The process of delivering a beta version to the users is called beta release and is typically the first time that the software is available outside of the organization that developed it. Software beta releases can be either open or closed, depending on whether they are openly available or only available to a limited audience. Beta version software is often useful for demonstrations and previews within an organization and to prospective customers. Some developers refer to this stage as a preview, preview release, prototype, technical preview or technology preview (TP), or early access.

Beta testers are people who actively report issues with beta software. They are usually customers or representatives of prospective customers of the organization that develops the software. Beta testers tend to volunteer their services free of charge but often receive versions of the product they test, discounts on the release version, or other incentives.

- **Perpetual beta**

Some software is kept in so-called perpetual beta, where new features are continually added to the software without establishing a final "stable" release. As the Internet has facilitated the rapid and inexpensive distribution of software, companies have begun to take a looser approach to the use of the word beta.

- **Open and closed beta**

Developers may release either a closed beta, or an open beta; closed beta versions are released to a restricted group of individuals for a user test by invitation, while open beta testers are from a larger group, or anyone interested. Private beta could be suitable for the software that is capable of delivering value but is not ready to be used by everyone either due to scaling issues, lack of documentation or still missing vital features. The testers report any bugs that they find, and sometimes suggest additional features they think should be available in the final version.

Open betas serve the dual purpose of demonstrating a product to potential consumers, and testing among a wide user base is likely to bring to light obscure errors that a much smaller testing team might not find.

- **Release candidate**

A release candidate (RC), also known as "going silver", is a beta version with the potential to be a stable product, which is ready to release unless significant bugs emerge. In this stage of product stabilization, all product features have been designed, coded, and tested through one or more beta cycles with no known showstopper-class bugs. A release is called code complete when the development team agrees that no entirely new source code will be added to this release. There could still be source code changes to fix defects, changes to documentation and data files, and peripheral code for test cases or utilities. Beta testers, if privately selected, will often be credited for using the release candidate as though it were a finished product. Beta testing is conducted in a client's or customer's location and to test the software from a user's perspective.

- **Stable release**

Also called production release, the stable release is the last release candidate (RC) which has passed all stages of verification and tests. The remaining bugs are considered acceptable. This release goes to production.

Some software products (e.g. Linux distributions) also have long term support (LTS) releases which are based on full releases that have already been tried and tested and receive only security updates. This allows developers to allocate more time toward product development instead of updating code or finding and fixing newly introduced bugs due to outdated assumptions about the used system, language, or underlying libraries.

## Appendix D: Commits

We follow the [git conventional commits](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13). Click in the link to find more information.

The commit should have the following structure:

```console
$ git commit -m "
    <type>(<scope>): <commit_description>

    <commit_body>

    <commit_footer>
```

#### Commit Type

The “type” field must be chosen from the options listed below:

- `build` : Changes related to building the code (e.g. build tool, ci pipeline, dependencies, project version, adding npm dependencies or external libraries).
- `chore`: Changes that do not affect the external user (e.g. updating the .gitignore file or .prettierrc file).
- `feature`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation a related changes.
- `refactor`: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name).
- `perf`: A code that improves performance style: A code that is related to styling.
- `test`: Adding new test or making changes to existing test
- `style`: Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
- `ops`: Commits, that affect operational components like infrastructure, deployment, backup, recovery, ...

#### Commit Scopes

The scope provides additional contextual information.

- It is an optional part of the format.
- Allowed Scopes depends on the specific project.
- Don't use issue identifiers as scopes.

#### Breaking Changes Indicator:

Breaking changes should be indicated by an ! before the : in the subject line e.g. feat(api)!: remove status endpoint.

- It is an optional part of the format.

#### Commit Description

The description contains a concise description of the change.

- It is a mandatory part of the format.
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Think of `This commit will...` or `This commit should...`
- Don't capitalize the first letter
- No dot (.) at the end

Commit example:

```console
$ git commit -m "feature(global): Remove non-JSX prop types checks"
```

#### Commit Body

The `body` should include the motivation for the change and contrast this with previous behavior.

- Is an optional part of the format. Include it if the commit description is not self-explanatory and requires an additional description.
- Use the imperative, present tense: "change" not "changed" nor "changes"
- This is the place to mention issue identifiers and their relations

#### Commit Footer:

The footer should contain any information about Breaking Changes and is also the place to reference Issues that this commit refers to.

- Is an optional part of the format
- Optionally reference an issue by its id.
- Breaking Changes should start with the word BREAKING CHANGES: followed by space or two newlines. The rest of the commit message is then used for this.

Commit example:

```console
$ git commit -m "feature(global): Remove non-JSX prop types checks

  non-JSX components are no longer part of the project

  refers to JIRA-1337

  BREAKING CHANGES: non-JSX props no longer supported."
  "
```

## Appendix E: Naming Conventions for git branches

1. Lowercase and Hyphen-Separated: Stick to lowercase for branch names and use hyphens to separate words.

   Example: feature/audio-chat or fix/wrong-score.

2. Alphanumeric Characters: Use only alphanumeric characters (a-z, 0–9) and hyphens. Avoid punctuation, spaces, underscores, or any non-alphanumeric character.

   Example: feature/audio-chat or bugfix/wrong-score

3. No Continuous Hyphens: Avoid continuous hyphens as they can be confusing and hard to read.
4. No Trailing Hyphens: Do not end your branch name with a hyphen.
5. Descriptive: Branch names should be descriptive and concise, ideally reflecting the work done on the branch.

- Branch Prefixes: Using prefixes in branch names enhances clarity about their purpose. Here are common branch types with their corresponding prefixes:

- Feature Branches: feature/ (e.g., feature/audio-chat).
- Bugfix Branches: fix/ (e.g., fix/wrong-score).
- Hotfix Branches: hotfix/ for critical production bug fixes (e.g., hotfix/critical-payment-issue).
- Release Branches: For releases I prefer using tags. Create and apply release tag to the release commit. OR We can also use release/ for preparing new production releases (e.g., release/v1.0.1).
- Documentation Branches: docs/ for writing, updating, or fixing documentation (e.g., docs/assets-optimization).

While Git doesn't enforce branch naming conventions, adhering to them is crucial for maintaining a clean and understandable codebase, especially in team settings. By following these conventions, you can ensure that your branches are easily identifiable and contribute to a smoother workflow.

## Appendix F: Pull Requests

Not available.
