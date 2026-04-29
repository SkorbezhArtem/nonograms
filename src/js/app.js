import { ALL_TEMPLATES, BY_DIFFICULTY, DIFFICULTIES, DIFFICULTY_LABELS, findTemplate } from './data/templates.js';
import { Game } from './game.js';
import { Sounds } from './sounds.js';
import { el, clear, icon, button, createSelect, createModal } from './ui.js';
import {
  saveGame,
  loadGame,
  hasSavedGame,
  clearSavedGame,
  loadScores,
  addScore,
  loadSettings,
  saveSettings,
} from './storage.js';
import { formatTime } from './timer.js';

const settings = Object.assign(
  { theme: 'light', muted: false, difficulty: 'easy', templateId: 'heart' },
  loadSettings(),
);

Sounds.setMuted(settings.muted);

// ----- Brand -----
const brandLogo = el('span', { class: 'brand__logo' }, [icon('grid', { size: 22 })]);
const title = el('h1', { class: 'title', text: 'Nonograms' });
const brand = el('div', { class: 'brand' }, [brandLogo, title]);

// ----- Custom selects -----
const levelSelect = createSelect({
  options: DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] })),
  value: DIFFICULTIES.includes(settings.difficulty) ? settings.difficulty : 'easy',
  icon: 'layers',
  ariaLabel: 'Level',
  onChange: (d) => {
    const opts = BY_DIFFICULTY[d].map((t) => ({ value: t.id, label: t.name }));
    templateSelect.setOptions(opts);
    const first = BY_DIFFICULTY[d][0];
    templateSelect.setValue(first.id);
    startTemplate(first.id);
  },
});

const initialDifficulty = levelSelect.getValue();
const templateSelect = createSelect({
  options: BY_DIFFICULTY[initialDifficulty].map((t) => ({ value: t.id, label: t.name })),
  value: findTemplate(settings.templateId) ? settings.templateId : BY_DIFFICULTY[initialDifficulty][0].id,
  icon: 'image',
  ariaLabel: 'Template',
  onChange: (id) => startTemplate(id),
});

// ----- Action buttons -----
const randomBtn = button({ label: 'Random', iconName: 'shuffle', onClick: onRandom });
const resetBtn = button({ label: 'Reset', iconName: 'rotate', onClick: () => game.reset() });
const saveBtn = button({ label: 'Save', iconName: 'save', onClick: onSave });
const continueBtn = button({ label: 'Continue', iconName: 'play', onClick: onContinue });
const solutionBtn = button({ label: 'Solution', iconName: 'lightbulb', onClick: onSolution });
const topBtn = button({ label: 'Top 5', iconName: 'trophy', variant: 'ghost', onClick: onOpenTop });
const themeBtn = button({ iconOnly: true, iconName: 'moon', title: 'Toggle theme', onClick: onToggleTheme });
const muteBtn = button({ iconOnly: true, iconName: 'volume-on', title: 'Toggle sound', onClick: onToggleMute });

// ----- Toolbar groups -----
function group(labelText, iconName, children) {
  const label = el('span', { class: 'toolbar__label' }, [
    icon(iconName, { size: 12, className: 'toolbar__label-icon' }),
    el('span', { text: labelText }),
  ]);
  return el('div', { class: `toolbar__group toolbar__group--${labelText.toLowerCase()}` }, [label, ...children]);
}

const toolbar = el('div', { class: 'toolbar' }, [
  group('Puzzle', 'sparkles', [levelSelect.element, templateSelect.element, randomBtn]),
  group('Game', 'clock', [resetBtn, saveBtn, continueBtn, solutionBtn]),
  group('More', 'medal', [topBtn, themeBtn, muteBtn]),
]);

const header = el('header', { class: 'header' }, [brand, toolbar]);

// ----- Status / board -----
const timerLabel = el('div', { class: 'timer', id: 'timer', text: '00:00' });
const messageBox = el('div', { class: 'message', id: 'message' });
const statusbar = el('div', { class: 'statusbar panel' }, [timerLabel, messageBox]);

const boardEl = el('div', { class: 'board', id: 'board' });
const boardWrap = el('div', { class: 'board-wrap' }, [boardEl]);

const layout = el('div', { class: 'layout' }, [boardWrap]);

const root = el('div', { class: 'app' }, [header, statusbar, layout]);
document.body.appendChild(root);

// ----- Top results modal -----
const scoresList = el('ol', { class: 'scores' });
const topModal = createModal({ title: 'Top 5 results' });
topModal.body.appendChild(scoresList);
document.body.appendChild(topModal.element);

// ----- Game instance -----
const game = new Game({
  boardEl,
  timerEl: timerLabel,
  messageEl: messageBox,
  onWin: ({ seconds, template }) => {
    const top = addScore({
      templateId: template.id,
      templateName: template.name,
      difficulty: template.difficulty,
      seconds,
      timestamp: Date.now(),
    });
    renderScores(top);
    clearSavedGame();
    syncContinueButton();
  },
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  clear(themeBtn);
  themeBtn.appendChild(icon(theme === 'dark' ? 'sun' : 'moon', { size: 16 }));
  themeBtn.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

function applyMute(muted) {
  Sounds.setMuted(muted);
  clear(muteBtn);
  muteBtn.appendChild(icon(muted ? 'volume-off' : 'volume-on', { size: 16 }));
  muteBtn.title = muted ? 'Unmute sounds' : 'Mute sounds';
}

function persistSettings() {
  saveSettings(settings);
}

function startTemplate(id) {
  const template = findTemplate(id);
  if (!template) return;
  settings.templateId = template.id;
  settings.difficulty = template.difficulty;
  persistSettings();
  game.setTemplate(template);
}

function renderScores(scores = loadScores()) {
  clear(scoresList);
  if (!scores.length) {
    scoresList.appendChild(el('li', { class: 'scores__empty' }, [
      icon('trophy', { size: 28, className: 'scores__empty-icon' }),
      el('span', { text: 'No results yet' }),
      el('small', { text: 'Solve a puzzle to claim a spot on the podium.' }),
    ]));
    return;
  }
  scores.forEach((s, i) => {
    const rank = el('span', { class: `scores__rank scores__rank--${Math.min(i + 1, 3)}`, text: String(i + 1) });
    const textBlock = el('div', { class: 'scores__text' }, [
      el('span', { class: 'scores__name', text: s.templateName }),
      el('span', { class: 'scores__diff', text: DIFFICULTY_LABELS[s.difficulty] || s.difficulty }),
    ]);
    const time = el('span', { class: 'scores__time' }, [
      icon('clock', { size: 14, className: 'scores__time-icon' }),
      el('span', { text: formatTime(s.seconds) }),
    ]);
    scoresList.appendChild(el('li', { class: 'scores__item' }, [rank, textBlock, time]));
  });
}

function syncContinueButton() {
  continueBtn.disabled = !hasSavedGame();
}

function onSave() {
  if (game.solved || game.frozen) return;
  saveGame(game.exportState());
  syncContinueButton();
  game.setMessage('Game saved.');
  setTimeout(() => {
    if (messageBox.textContent === 'Game saved.') game.setMessage('');
  }, 1500);
}

function onContinue() {
  const state = loadGame();
  if (!state) return;
  const template = findTemplate(state.templateId);
  if (!template) return;
  settings.templateId = template.id;
  settings.difficulty = template.difficulty;
  persistSettings();
  levelSelect.setValue(template.difficulty);
  templateSelect.setOptions(BY_DIFFICULTY[template.difficulty].map((t) => ({ value: t.id, label: t.name })));
  templateSelect.setValue(template.id);
  game.setTemplate(template);
  game.loadState(state);
}

function onRandom() {
  const others = ALL_TEMPLATES.filter((t) => !game.template || t.id !== game.template.id);
  const pick = others[Math.floor(Math.random() * others.length)];
  levelSelect.setValue(pick.difficulty);
  templateSelect.setOptions(BY_DIFFICULTY[pick.difficulty].map((t) => ({ value: t.id, label: t.name })));
  templateSelect.setValue(pick.id);
  startTemplate(pick.id);
}

function onSolution() {
  game.showSolution();
  clearSavedGame();
  syncContinueButton();
}

function onOpenTop() {
  renderScores();
  topModal.open();
}

function onToggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(settings.theme);
  persistSettings();
}

function onToggleMute() {
  settings.muted = !settings.muted;
  applyMute(settings.muted);
  persistSettings();
}

// Disable native context menu on board to avoid right-click menu
boardEl.addEventListener('contextmenu', (e) => e.preventDefault());

// ----- Init -----
applyMute(settings.muted);
applyTheme(settings.theme);

const initialTemplate = findTemplate(settings.templateId)
  || BY_DIFFICULTY[initialDifficulty][0];
game.setTemplate(initialTemplate);
syncContinueButton();
