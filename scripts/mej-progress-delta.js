const MODULE_ID = "mej-progress-delta";
const PATCH_FLAG = Symbol(`${MODULE_ID}.list-sheet-patched`);
const ROW_SELECTOR = "li.list-item.document[data-document-id]";
const PROGRESS_SELECTOR = ".progress-container";
const VALID_DELTA_PATTERN = /^[+-]?\d+$/;

Hooks.once("ready", () => {
  const monksEnhancedJournal = game.modules.get("monks-enhanced-journal");
  if (!monksEnhancedJournal?.active) {
    console.warn(`${MODULE_ID} | Monk's Enhanced Journal is not active; patch not applied.`);
    return;
  }

  const listSheetClass = game.MonksEnhancedJournal?.getDocumentTypes?.()?.list;
  if (!listSheetClass?.prototype?.activateListeners) {
    console.warn(`${MODULE_ID} | Could not find Monk's Enhanced Journal ListSheet; patch not applied.`);
    return;
  }

  if (listSheetClass.prototype[PATCH_FLAG]) return;

  const originalActivateListeners = listSheetClass.prototype.activateListeners;
  listSheetClass.prototype.activateListeners = async function patchedActivateListeners(html) {
    await originalActivateListeners.call(this, html);
    enhanceProgressRows(this, html);
  };

  Object.defineProperty(listSheetClass.prototype, PATCH_FLAG, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
  });

  console.log(`${MODULE_ID} | Patched Monk's Enhanced Journal Progress list controls.`);
});

function enhanceProgressRows(sheet, html) {
  if (!isEditableProgressSheet(sheet)) return;

  const root = getRootElement(html);
  if (!root) return;

  for (const row of root.querySelectorAll(ROW_SELECTOR)) {
    const progressContainer = row.querySelector(PROGRESS_SELECTOR);
    if (!progressContainer) continue;
    if (progressContainer.dataset.mejProgressDeltaApplied === "true") continue;

    const decreaseButton = progressContainer.querySelector(".progress-button.decrease[data-action='updateProgress']");
    const increaseButton = progressContainer.querySelector(".progress-button.increase[data-action='updateProgress']");
    const progressBar = progressContainer.querySelector(".progress");

    if (!decreaseButton || !increaseButton || !progressBar) continue;

    const deltaInput = createDeltaInput();
    const applyButton = createApplyButton();

    const applyDelta = async () => {
      await applyProgressDelta(sheet, row, deltaInput, applyButton);
    };

    bindControlEvents(deltaInput, applyButton, applyDelta);

    decreaseButton.replaceWith(deltaInput);
    increaseButton.replaceWith(applyButton);

    progressContainer.classList.add("mej-progress-delta");
    progressContainer.dataset.mejProgressDeltaApplied = "true";
  }
}

function isEditableProgressSheet(sheet) {
  return sheet?.subtype === "progress" && sheet?.document?.isOwner === true;
}

function getRootElement(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.jquery && html.length) return html[0];
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

function createDeltaInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.placeholder = "+0";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.className = "mej-progress-delta-input";
  input.setAttribute("aria-label", "Progress delta");
  return input;
}

function createApplyButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "progress-button mej-progress-delta-apply";
  button.textContent = "Apply";
  button.setAttribute("aria-label", "Apply progress delta");
  return button;
}

function bindControlEvents(input, button, applyDelta) {
  const stopRowInteraction = (event) => event.stopPropagation();

  input.addEventListener("click", stopRowInteraction);
  input.addEventListener("dblclick", stopRowInteraction);
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await applyDelta();
  });
  button.addEventListener("dblclick", stopRowInteraction);

  input.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    await applyDelta();
  });
}

async function applyProgressDelta(sheet, row, input, button) {
  const rawValue = input.value.trim();
  if (!VALID_DELTA_PATTERN.test(rawValue)) {
    ui.notifications.warn("Enter a whole number such as +345, -7, or 12.");
    return;
  }

  const delta = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(delta)) {
    ui.notifications.warn("Enter a whole number such as +345, -7, or 12.");
    return;
  }

  const entryId = row?.dataset?.documentId;
  const entries = foundry.utils.duplicate(
    foundry.utils.getProperty(sheet.document, "flags.monks-enhanced-journal.entries") || []
  );
  const entry = entries.find((candidate) => candidate.id === entryId);

  if (!entry) {
    ui.notifications.warn("Could not find the Progress item to update.");
    return;
  }

  // Read the current Progress value from Monk's own source-of-truth entry data.
  const currentCount = Number.isInteger(Number.parseInt(entry.count, 10))
    ? Number.parseInt(entry.count, 10)
    : 0;
  const maxValue = Number.parseInt(entry.max, 10);

  if (!Number.isInteger(maxValue)) {
    ui.notifications.warn("This Progress item is missing a valid maximum value.");
    return;
  }

  // Persist the updated count back to the exact MEJ data path used by ListSheet.
  entry.count = Math.clamp(currentCount + delta, 0, maxValue);

  setBusyState(input, button, true);

  try {
    await sheet.document.update({ "flags.monks-enhanced-journal.entries": entries });
    input.value = "";
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to update Progress item.`, error);
    ui.notifications.error("Could not update the Progress item.");
  } finally {
    setBusyState(input, button, false);
  }
}

function setBusyState(input, button, isBusy) {
  input.disabled = isBusy;
  button.disabled = isBusy;
}
