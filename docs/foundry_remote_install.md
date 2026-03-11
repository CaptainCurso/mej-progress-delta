# Foundry Remote Install (GitHub Manifest Workflow)

This guide lets you install or update `mej-progress-delta` in Foundry using a manifest URL, following the same GitHub flow used by other Foundry projects in this workspace.

## Where the module is

- Module source folder:
  - `/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta`
- Module manifest file:
  - `/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/module.json`

## Terms

- Manifest URL: the public URL to `module.json` that Foundry reads to install or update a module.
- Download URL: the public URL to the release zip file Foundry downloads.

## Recommended hosting (GitHub)

1. Create a GitHub repository for this project.
2. Add that repository as `origin`.
3. Push this repo to GitHub.
4. Keep `module.json` committed on the default branch.

Example:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Command explanation:

- `git remote add origin ...` registers the GitHub repository URL under the conventional remote name `origin`.
- `git push -u origin main` publishes the current branch and sets the default upstream for later `git push` and `git pull`.

Risk:

- If this repo already has an `origin`, the first command fails instead of replacing it.

## Prepare a release build

From:

- `/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta`

Run:

```bash
MODULE_VERSION=1.0.0 \
MODULE_URL=https://github.com/<you>/<repo> \
MODULE_MANIFEST_URL=https://raw.githubusercontent.com/<you>/<repo>/main/module.json \
MODULE_DOWNLOAD_URL=https://github.com/<you>/<repo>/releases/download/v1.0.0/mej-progress-delta-v1.0.0.zip \
npm run module:prepare-release
```

What this does:

- Updates `module.json` fields:
  - `version`
  - `url`
  - `manifest`
  - `download`
- Produces a release zip at:
  - `dist/module-release/mej-progress-delta-v<version>.zip`

Risk:

- This edits `module.json` in place. Review the file before committing.

## Publish on GitHub

After preparing the release:

```bash
npm run module:publish-release
```

What this does:

- checks that GitHub CLI (`gh`) is installed and authenticated
- creates release `v<version>` if it does not exist
- uploads the prepared zip asset to that release

Risk:

- This publishes to the configured GitHub repository for the current checkout. Confirm the remote and version first.

## Install in Foundry

In Foundry:

1. Go to **Add-on Modules**.
2. Click **Install Module**.
3. Paste `MODULE_MANIFEST_URL`.
4. Install and enable `MEJ Progress Delta` in your world.

## Update flow

For each new version:

1. Bump the version you plan to release.
2. Re-run `npm run module:prepare-release` with the new URLs.
3. Commit the updated `module.json`.
4. Publish the new release/tag and upload the zip.
5. In Foundry, update the module.
