import { ALL_TEMPLATES, BY_DIFFICULTY, DIFFICULTIES, DIFFICULTY_LABELS, findTemplate } from './data/templates.js';
import { Game } from './game.js';
import { Sounds } from './sounds.js';
import { el, clear } from './ui.js';
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

// ----- Layout -----
const root = el('div', { class: 'app' });

const title = el('h1', { class: 'title', text: 'Nonograms' });

const difficultySelect = el('select', { class: 'select', id: 'difficulty' });
for (const d of DIFFICULTIES) {
  difficultySelect.appendChild(el('option', { value: d, text: DIFFICULTY_LABELS[d] }));
}

const templateSelect = el('select', { class: 'select', id: 'template' });

const themeBtn = el('button', { class: 'btn btn--icon', title: 'Toggle theme' });
const muteBtn = el('button', { class: 'btn btn--icon', title: 'Toggle sound' });

const resetBtn = el('button', { class: 'btn', text: 'Reset game' });
const saveBtn = el('button', { class: 'btn', text: 'Save game' });
const continueBtn = el('button', { class: 'btn', text: 'Continue last game' });
const randomBtn = el('button', { class: 'btn', text: 'Random game' });
const solutionBtn = el('button', { class: 'btn', text: 'Solution' });

const controls = el('div', { class: 'controls' }, [
  el('label', { class: 'label' }, ['Level', difficultySelect]),
  el('label', { class: 'label' }, ['Template', templateSelect]),
  randomBtn,
  resetBtn,
  saveBtn,
  continueBtn,
  solutionBtn,
  themeBtn,
  muteBtn,
]);

const header = el('div', { class: 'header' }, [title, controls]);

const timerLabel = el('div', { class: 'timer', id: 'timer', text: '00:00' });
const messageBox = el('div', { class: 'message', id: 'message' });
const statusbar = el('div', { class: 'statusbar panel' }, [timerLabel, messageBox]);

const boardEl = el('div', { class: 'board', id: 'board' });
const boardWrap = el('div', { class: 'board-wrap' }, [boardEl]);

const scoresPanel = el('div', { class: 'panel' }, [
  el('h3', { text: 'Top 5 results' }),
  el('ol', { class: 'scores', id: 'scores' }),
]);

const sidebar = el('aside', { class: 'sidebar' }, [scoresPanel]);

const layout = el('div', { class: 'layout' }, [boardWrap, sidebar]);

root.appendChild(header);
root.appendChild(statusbar);
root.appendChild(layout);
document.body.appendChild(root);

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

function renderTemplateOptions(difficulty) {
  clear(templateSelect);
  for (const t of BY_DIFFICULTY[difficulty]) {
    templateSelect.appendChild(el('option', { value: t.id, text: t.name }));
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
}

function applyMute(muted) {
  Sounds.setMuted(muted);
  muteBtn.textContent = muted ? '🔇' : '🔊';
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
  const list = document.getElementById('scores');
  clear(list);
  if (!scores.length) {
    list.appendChild(el('li', { class: 'empty', text: 'No results yet' }));
    return;
  }
  for (const s of scores) {
    const left = el('span', { text: `${s.templateName} (${s.difficulty})` });
    const right = el('span', { text: formatTime(s.seconds) });
    list.appendChild(el('li', {}, [left, right]));
  }
}

function syncContinueButton() {
  continueBtn.disabled = !hasSavedGame();
  continueBtn.style.opacity = continueBtn.disabled ? '0.5' : '1';
}

// ----- Wire controls -----
difficultySelect.addEventListener('change', () => {
  const d = difficultySelect.value;
  renderTemplateOptions(d);
  const first = BY_DIFFICULTY[d][0];
  templateSelect.value = first.id;
  startTemplate(first.id);
});

templateSelect.addEventListener('change', () => {
  startTemplate(templateSelect.value);
});

resetBtn.addEventListener('click', () => {
  game.reset();
});

saveBtn.addEventListener('click', () => {
  if (game.solved || game.frozen) return;
  saveGame(game.exportState());
  syncContinueButton();
  game.setMessage('Game saved.');
  setTimeout(() => {
    if (messageBox.textContent === 'Game saved.') game.setMessage('');
  }, 1500);
});

continueBtn.addEventListener('click', () => {
  const state = loadGame();
  if (!state) return;
  const template = findTemplate(state.templateId);
  if (!template) return;
  settings.templateId = template.id;
  settings.difficulty = template.difficulty;
  persistSettings();
  difficultySelect.value = template.difficulty;
  renderTemplateOptions(template.difficulty);
  templateSelect.value = template.id;
  game.setTemplate(template);
  game.loadState(state);
});

randomBtn.addEventListener('click', () => {
  const others = ALL_TEMPLATES.filter((t) => !game.template || t.id !== game.template.id);
  const pick = others[Math.floor(Math.random() * others.length)];
  difficultySelect.value = pick.difficulty;
  renderTemplateOptions(pick.difficulty);
  templateSelect.value = pick.id;
  startTemplate(pick.id);
});

solutionBtn.addEventListener('click', () => {
  game.showSolution();
  clearSavedGame();
  syncContinueButton();
});

themeBtn.addEventListener('click', () => {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(settings.theme);
  persistSettings();
});

muteBtn.addEventListener('click', () => {
  settings.muted = !settings.muted;
  applyMute(settings.muted);
  persistSettings();
});

// Disable native context menu on board to avoid right-click menu
boardEl.addEventListener('contextmenu', (e) => e.preventDefault());

// ----- Init -----
applyMute(settings.muted);
applyTheme(settings.theme);

const initialDifficulty = DIFFICULTIES.includes(settings.difficulty) ? settings.difficulty : 'easy';
difficultySelect.value = initialDifficulty;
renderTemplateOptions(initialDifficulty);
const initialTemplate = findTemplate(settings.templateId)
  || BY_DIFFICULTY[initialDifficulty][0];
templateSelect.value = initialTemplate.id;
game.setTemplate(initialTemplate);
renderScores();
syncContinueButton();
