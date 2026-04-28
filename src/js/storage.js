const SAVE_KEY = 'nonograms.save';
const SCORES_KEY = 'nonograms.scores';
const SETTINGS_KEY = 'nonograms.settings';

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearSavedGame() {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSavedGame() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}

export function loadScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

export function addScore(entry) {
  const scores = loadScores();
  scores.push(entry);
  scores.sort((a, b) => a.seconds - b.seconds);
  const top = scores.slice(0, 5);
  localStorage.setItem(SCORES_KEY, JSON.stringify(top));
  return top;
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
