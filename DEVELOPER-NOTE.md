# Developer Note

## Upstream Files Inspected

These Monk's Enhanced Journal files were inspected before implementing the patch:

- `monks-enhanced-journal.js`
- `sheets/ListSheet.js`
- `apps/list-item-edit.js`
- `templates/sheets/list.html`
- `templates/sheets/partials/list-template-progress.html`
- `templates/sheets/list-item-edit.html`
- `css/monks-journal-sheet.css`

## Progress Handling Found Upstream

- Progress is not a separate sheet class in Monk's Enhanced Journal `13.06`.
- It is handled by the shared `ListSheet` class in `sheets/ListSheet.js`.
- The subtype is detected through:
  - `this.document.getFlag("monks-enhanced-journal", "subtype", "basic")`
- The Progress row template is:
  - `templates/sheets/partials/list-template-progress.html`
- The built-in single-step change handler is:
  - `ListSheet.onUpdateProgress`

## Patch Point

This companion module patches Monk's runtime behavior by wrapping:

- `game.MonksEnhancedJournal.getDocumentTypes().list.prototype.activateListeners`

The wrapper lets Monk's original listeners bind first, then updates the rendered DOM only for `progress` subtype sheets owned by the current user.

## Exact Data Path

The patch reads and writes Monk's existing Progress item data here:

- `flags.monks-enhanced-journal.entries[*].count`
- `flags.monks-enhanced-journal.entries[*].max`

Persistence uses the same update flow Monk's `ListSheet.onUpdateProgress` method uses:

- `sheet.document.update({ "flags.monks-enhanced-journal.entries": entries })`

## Behavior Preserved

- Existing progress bar rendering
- Existing `count/max` value display
- Existing clamp behavior from `0` to `max`
- Existing owner-only control visibility

## Companion Module Files

- [`module.json`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/module.json)
- [`scripts/mej-progress-delta.js`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/scripts/mej-progress-delta.js)
- [`styles/mej-progress-delta.css`](/Users/nicholasmcdowell/Documents/Codex Projects/Progress List Delta/styles/mej-progress-delta.css)
