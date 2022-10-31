import {Octokit} from '@octokit/rest';
import * as chalk from 'chalk';
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

import {BaseReleaseTask} from './base-release-task';
import {promptAndGenerateChangelog} from './changelog';
import {GitClient} from './git/git-client';
import {getGithubBranchCommitsUrl} from './git/github-urls';
import {promptForNewVersion} from './prompt/new-version-prompt';
import {checkPackageJsonMigrations} from './release-output/output-validations';
import {parseVersionName, Version} from './version-name/parse-version';
import { GetProjectConfig, PackageConfig } from './.package-config';

/** Default filename for the changelog. */
export const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/**
 * Class that can be instantiated in order to stage a new release. The tasks requires user
 * interaction/input through command line prompts.
 *
 * Staging a release involves the following the steps:
 *
 *  1) Prompt for release type (with version suggestion)
 *  2) Prompt for version name if no suggestions has been selected
 *  3) Assert that there are no local changes which are uncommitted.
 *  4) Assert that the proper publish branch is checked out. (e.g. 6.4.x for patches)
 *     If a different branch is used, try switching to the publish branch automatically
 *  5) Assert that the Github status checks pass for the publish branch.
 *  6) Assert that the local branch is up to date with the remote branch.
 *  7) Creates a new branch for the release staging (release-stage/{VERSION})
 *  8) Switches to the staging branch and updates the package.json
 *  9) Prompt for release name and generate changelog
 *  10) Wait for the user to continue (users can customize generated changelog)
 *  11) Create a commit that includes all changes in the staging branch.
 */
class StageReleaseTask extends BaseReleaseTask {
  /** Path to the project package JSON. */
  packageJsonPath: string;

  /** Serialized package.json of the specified project. */
  packageJson: any;

  packageConfig: PackageConfig;

  /** Parsed current version of the project. */
  currentVersion: Version;

  /** Instance of a wrapper that can execute Git commands. */
  git: GitClient;

  /** Octokit API instance that can be used to make Github API calls. */
  githubApi: Octokit;
  
  repositoryOwner: string;
  repositoryName: string;

  constructor(public projectDir: string,
              public packagesDir: string) {
    super(null as any);

    var packageInfo = GetProjectConfig(projectDir);
    this.packageJsonPath = packageInfo.packageJsonPath;
    this.packageJson = packageInfo.packageJson;
    this.packageConfig = packageInfo.packageConfig;

    const gitRepoInfo = this.resolveGitRepo();

    this.repositoryOwner = gitRepoInfo.repositoryOwner;
    this.repositoryName = gitRepoInfo.repositoryName;
    this.git = new GitClient(projectDir, gitRepoInfo.url);

    console.log();
    console.log(chalk.cyan(`👍 ${this.repositoryOwner}/${this.repositoryName} | ${gitRepoInfo.url}`));
    console.log();

    this.currentVersion = parseVersionName(this.packageJson.version)!;

    if (!this.currentVersion) {
      console.error(chalk.red(
          `Cannot parse current version in ${chalk.italic('package.json')}. Please ` +
          `make sure "${this.packageJson.version}" is a valid Semver version.`));
      process.exit(1);
    }

    this.githubApi = new Octokit();
  }

  async run() {
    console.log();
    console.log(chalk.cyan('-----------------------------------------'));
    console.log(chalk.cyan(`  ${this.packageJson.name} stage release script`));
    console.log(chalk.cyan('-----------------------------------------'));
    console.log();

    const newVersion = await promptForNewVersion(this.currentVersion);
    const newVersionName = newVersion.format();
    const needsVersionBump = !newVersion.equals(this.currentVersion);
    const stagingBranch = `release-stage/${newVersionName}`;

    // After the prompt for the new version, we print a new line because we want the
    // new log messages to be more in the foreground.
    console.log();

    // Ensure there are no uncommitted changes. Checking this before switching to a
    // publish branch is sufficient as unstaged changes are not specific to Git branches.

    // this.verifyNoUncommittedChanges();

    // Branch that will be used to stage the release for the new selected version.
    const publishBranch = await this.assertValidPublishBranch(newVersion);

    this.verifyLocalCommitsMatchUpstream(publishBranch);
    // this._verifyAngularPeerDependencyVersion(newVersion);
    // this._checkUpdateMigrationCollection(newVersion);
    // await this._verifyPassingGithubStatus(publishBranch);

    // if (!this.git.checkoutNewBranch(stagingBranch)) {
    //   console.error(
    //       chalk.red(`Could not create release staging branch: ${stagingBranch}. Aborting...`));
    //   process.exit(1);
    // }

    if (needsVersionBump) {
      this._updatePackageJsonVersion(newVersionName);

      console.log(chalk.green(
          `  ✓   Updated the version to "${chalk.bold(newVersionName)}" inside of the ` +
          `${chalk.italic('package.json')}`));
      console.log();
    }

    await promptAndGenerateChangelog(join(this.projectDir, CHANGELOG_FILE_NAME), this.packageConfig);

    console.log();
    console.log(chalk.green(
        `  ✓   Updated the changelog in ` +
        `"${chalk.bold(CHANGELOG_FILE_NAME)}"`));
    console.log(chalk.yellow(
        `  ⚠   Please review CHANGELOG.md and ensure that the log contains only changes ` +
        `that apply to the public library release. When done, proceed to the prompt below.`));
    console.log();

    if (!await this.promptConfirm('Do you want to proceed and commit the changes?')) {
      console.log();
      console.log(chalk.yellow('Aborting release staging...'));
      process.exit(0);
    }

    this.git.stageAllChanges();

    // Note: When updating the commit messages here. Please also update the
    // release publish script to detect the new commit messages.
    if (needsVersionBump) {
      this.git.createNewCommit(`release: bump version to ${newVersionName} w/ changelog`);
    } else {
      this.git.createNewCommit(`release: update changelog for ${newVersionName}`);
    }

    console.info();
    console.info(chalk.green(`  ✓   Created the staging commit for: "${newVersionName}".`));
    console.info(chalk.green(`  ✓   Please push the changes and submit a PR on GitHub.`));
    console.info();

    // TODO(devversion): automatic push and PR open URL shortcut.
  }

  /** Updates the version of the project package.json and writes the changes to disk. */
  private _updatePackageJsonVersion(newVersionName: string) {
    const newPackageJson = {...this.packageJson, version: newVersionName};
    writeFileSync(this.packageJsonPath, JSON.stringify(newPackageJson, null, 2) + '\n');
    this._updateLibPackageJsonVersion(newVersionName);
  }

  private _updateLibPackageJsonVersion(newVersionName: string) {
    const possibleDependencies: string[] = [];

    for (const p of this.packageConfig.releasePackages) {
      const pkgJsonPath = join(this.packagesDir, p, 'package.json');
      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));

      pkgJson.version = newVersionName;
      for (const key of ['dependencies', 'peerDependencies']) {
        const o = pkgJson[key];
        if (o) {
          for (const dep of possibleDependencies) {
            if (o[dep]) {
              o[dep] = newVersionName;
            }
          }
        }
      }
      writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
      possibleDependencies.push(pkgJson.name);
    }
  }

  /**
   * Ensures that the Angular version placeholder has been correctly updated to support
   * given Angular versions. The following rules apply:
   *   `N.x.x` requires Angular `^N.0.0 || (N+1).0.0-0`
   *   `N.0.0-x` requires Angular `^N.0.0-0 || (N+1).0.0-0`
   */
  private _verifyAngularPeerDependencyVersion(newVersion: Version) {
    const currentVersionRange = this.packageConfig.angularPackageVersion;
    const isMajorWithPrerelease =
        newVersion.minor === 0 && newVersion.patch === 0 && newVersion.prereleaseLabel !== null;
    const requiredRange = isMajorWithPrerelease ?
        `^${newVersion.major}.0.0-0 || ^${newVersion.major + 1}.0.0-0` :
        `^${newVersion.major}.0.0 || ^${newVersion.major + 1}.0.0-0`;

    if (requiredRange !== currentVersionRange) {
      console.error(chalk.red(
          `  ✘   Cannot stage release. The required Angular version range ` +
          `is invalid. The version range should be: ${requiredRange}`));
      console.error(chalk.red(
          `      Please manually update the version range ` +
          `in: '.package-config.ts'`));
      return process.exit(1);
    }
  }

  /** Verifies that the latest commit of the current branch is passing all Github statuses. */
  private async _verifyPassingGithubStatus(expectedPublishBranch: string) {
    const commitRef = this.git.getLocalCommitSha('HEAD');
    const githubCommitsUrl =
        getGithubBranchCommitsUrl(this.repositoryOwner, this.repositoryName, expectedPublishBranch);
    const {state} = (await this.githubApi.repos.getCombinedStatusForRef({
                      owner: this.repositoryOwner,
                      repo: this.repositoryName,
                      ref: commitRef,
                    })).data;

    if (state === 'failure') {
      console.error(chalk.red(
          `  ✘   Cannot stage release. Commit "${commitRef}" does not pass all github ` +
          `status checks. Please make sure this commit passes all checks before re-running.`));
      console.error(chalk.red(`      Please have a look at: ${githubCommitsUrl}`));
      if (await this.promptConfirm('Do you want to ignore the Github status and proceed?')) {
        console.info(chalk.green(
            `  ⚠   Upstream commit is failing CI checks, but status has been ` +
            `forcibly ignored.`));
        return;
      }
      process.exit(1);
    } else if (state === 'pending') {
      console.error(chalk.red(
          `  ✘   Commit "${commitRef}" still has pending github statuses that ` +
          `need to succeed before staging a release.`));
      console.error(chalk.red(`      Please have a look at: ${githubCommitsUrl}`));
      if (await this.promptConfirm('Do you want to ignore the Github status and proceed?')) {
        console.info(chalk.green(
            `  ⚠   Upstream commit is pending CI, but status has been ` +
            `forcibly ignored.`));
        return;
      }
      process.exit(0);
    }

    console.info(chalk.green(`  ✓   Upstream commit is passing all github status checks.`));
  }

  /**
   * Checks if the update migration collections are set up to properly
   * handle the given new version.
   */
  private _checkUpdateMigrationCollection(newVersion: Version) {
    const failures: string[] = [];
    this.packageConfig.releasePackages.forEach(packageName => {
      failures.push(...checkPackageJsonMigrations(
                        join(this.packagesDir, packageName, 'package.json'), newVersion)
                        .map(f => chalk.yellow(`       ⮑  ${chalk.bold(packageName)}: ${f}`)));
    });
    if (failures.length) {
      console.error(chalk.red(`  ✘   Failures in ng-update migration collection detected:`));
      failures.forEach(f => console.error(f));
      process.exit(1);
    }
  }

  private resolveGitRepo(): { repositoryOwner: string, repositoryName: string, url: string }
  {  
    let repo = this.packageJson.repository;
    let repositoryOwner = "";
    let repositoryName = "";
    let url = "";
    if (typeof(repo) === 'string')
    {
      let match = /^(.+):(.+)\/(.+)$/.exec(repo);
      if (match === null)
      {
        throw new Error(`Invalid repository in package.json. Got: ${repo}`);
      }

      repositoryOwner = match[2];
      repositoryName = match[3];
      url = "";
      switch (match[1])
      {
        case "github":
          url = `https://github.com/${repositoryOwner}/${repositoryName}.git`;
          break;
        case "bitbucket":
          url = `https://bitbucket.org/${repositoryOwner}/${repositoryName}.git`;
          break;
        case "gitlab":
          url = `https://gitlab.com/${repositoryOwner}/${repositoryName}.git`;
          break;
        default:
          throw new Error(`Invalid repository in package.json. Got: ${repo}`);
      }
    } else if (typeof(repo) === 'object')
    {
      url = repo.url;
      let match = /^https?:\/\/.+\/(.+)\/(.+)\.git$/.exec(url);
      if (match === null)
      {
        throw new Error(`Invalid repository object in package.json.`);
      }
      repositoryOwner = match[1];
      repositoryName = match[2];
    }
    return { repositoryOwner, repositoryName, url };
  }

}

/** Entry-point for the release staging script. */
if (require.main === module) {
  const projectDir = join(__dirname, '../../../');
  new StageReleaseTask(projectDir, join(projectDir, 'libs/')).run();
}
