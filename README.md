# MEJ Progress Delta

`MEJ Progress Delta` is a small companion module for Foundry Virtual Tabletop (Foundry VTT). It patches Monk's Enhanced Journal so the `Progress` list subtype uses a signed number input and an `Apply` button instead of the built-in single-step `+` and `-` buttons.

## What It Does

In Monk's Enhanced Journal `Progress` lists, this module replaces the owner-only increment and decrement buttons with:

- one text input for signed integers
- one `Apply` button

Examples:

- `+345` adds 345
- `-564` subtracts 564
- `12` adds 12
- `-7` subtracts 7

The current total still uses Monk's Enhanced Journal's built-in progress display, including the bar and `count/max` text.

## Compatibility

- Foundry VTT generation `13`
- Monk's Enhanced Journal `13.06`

This patch depends on Monk's Enhanced Journal continuing to:

- use the shared `ListSheet` class for `list` pages
- detect `Progress` using the `monks-enhanced-journal.subtype` flag
- render Progress rows through `templates/sheets/partials/list-template-progress.html`
- store values in `flags.monks-enhanced-journal.entries[*].count` and `flags.monks-enhanced-journal.entries[*].max`

If Monk's Enhanced Journal changes those internals in a later release, this companion module may need an update.

## Installation

A `module manifest` is Foundry's `module.json` file. Foundry reads that file to learn the module id, version, scripts, and compatibility.

1. Create a folder named `mej-progress-delta` inside your Foundry user data modules folder.
2. Copy these files into that folder:
   - `module.json`
   - `scripts/mej-progress-delta.js`
   - `styles/mej-progress-delta.css`
3. Open Foundry.
4. In your world, enable both:
   - Monk's Enhanced Journal
   - MEJ Progress Delta
5. Open a journal page that uses Monk's Enhanced Journal `list` type with the `progress` subtype.

## Publishing For Foundry Remote Install

If you want to install this module from any Foundry setup using a URL, a local git repository is only the first step. You also need to host the repository online, usually on GitHub, and then add these three fields to `module.json` after you know the real repository URL:

- `url`: the repository page
- `manifest`: the raw hosted `module.json` URL
- `download`: a zip file URL for a tagged release

Typical GitHub flow:

1. Push this repository to GitHub.
2. Create a release tag such as `v1.0.0`.
3. Upload a zip of the module files to that release, or use an automated release workflow.
4. Update `module.json` with the GitHub repository, manifest, and zip URLs.
5. Paste the hosted `manifest` URL into Foundry's `Install Module` dialog.

## How To Use It

1. Open a Progress list entry as an owner or GM.
2. Find the new delta input next to the existing progress bar.
3. Type a whole number:
   - signed, like `+345` or `-564`
   - unsigned, like `12`
4. Click `Apply`, or press `Enter`.
5. The total will update and persist through Monk's normal document update flow.

## Validation Rules

Invalid input is rejected with a Foundry notification. These values are invalid:

- empty input
- spaces only
- decimals like `12.5`
- text like `abc`

## Permissions

- The patch only changes the `Progress` subtype.
- It only injects the new controls for owners, matching Monk's existing owner-only `+` and `-` behavior.
- Other Monk's Enhanced Journal list subtypes are left alone.

## Source Layout

- [`module.json`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/module.json)
- [`scripts/mej-progress-delta.js`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/scripts/mej-progress-delta.js)
- [`styles/mej-progress-delta.css`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/styles/mej-progress-delta.css)
- [`DEVELOPER-NOTE.md`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/DEVELOPER-NOTE.md)
