import { rowClues, colClues, maxRowClueLength, maxColClueLength } from './clues.js';
import { el, clear } from './ui.js';
import { Sounds } from './sounds.js';
import { Timer, formatTime } from './timer.js';

const STATE = { EMPTY: 0, FILLED: 1, CROSS: 2 };

export class Game {
  constructor({ boardEl, timerEl, messageEl, onWin }) {
    this.boardEl = boardEl;
    this.timerEl = timerEl;
    this.messageEl = messageEl;
    this.onWin = onWin || (() => {});

    this.template = null;
    this.size = 0;
    this.userGrid = [];
    this.cellEls = [];
    this.solved = false;
    this.frozen = false;

    this.timer = new Timer((s) => {
      this.timerEl.textContent = formatTime(s);
    });
  }

  setTemplate(template, { preserveCells = false, preserveTimer = false } = {}) {
    this.template = template;
    this.size = template.size;
    if (!preserveCells) {
      this.userGrid = Array.from({ length: this.size }, () => Array(this.size).fill(STATE.EMPTY));
    }
    this.solved = false;
    this.frozen = false;
    if (!preserveTimer) {
      this.timer.reset();
    }
    this.setMessage('');
    this.render();
  }

  loadState(state) {
    if (!state || !state.userGrid) return;
    this.userGrid = state.userGrid.map((row) => row.slice());
    this.timer.setSeconds(state.seconds || 0);
    this.solved = false;
    this.frozen = false;
    this.setMessage('');
    this.render();
  }

  exportState() {
    return {
      templateId: this.template.id,
      userGrid: this.userGrid.map((r) => r.slice()),
      seconds: this.timer.seconds,
      timestamp: Date.now(),
    };
  }

  reset() {
    this.userGrid = Array.from({ length: this.size }, () => Array(this.size).fill(STATE.EMPTY));
    this.solved = false;
    this.frozen = false;
    this.timer.reset();
    this.setMessage('');
    this.render();
  }

  showSolution() {
    this.userGrid = this.template.grid.map((row) => row.map((v) => (v === 1 ? STATE.FILLED : STATE.EMPTY)));
    this.timer.stop();
    this.frozen = true;
    this.solved = false;
    this.setMessage('Solution shown. This does not count as a win.');
    this.render();
  }

  setMessage(text) {
    const next = text || '';
    if (this.messageEl.textContent === next) return;
    this.messageEl.textContent = next;
    if (next) {
      this.messageEl.classList.remove('message--in');
      // trigger reflow so animation restarts
      // eslint-disable-next-line no-unused-expressions
      this.messageEl.offsetWidth;
      this.messageEl.classList.add('message--in');
    } else {
      this.messageEl.classList.remove('message--in');
    }
  }

  render() {
    const t = this.template;
    if (!t) return;
    const n = this.size;
    const rClues = rowClues(t.grid);
    const cClues = colClues(t.grid);
    const rowPad = maxRowClueLength(rClues);
    const colPad = maxColClueLength(cClues);

    clear(this.boardEl);
    this.cellEls = Array.from({ length: n }, () => Array(n).fill(null));
    this.boardEl.dataset.size = String(n);
    this.boardEl.style.gridTemplateColumns = `repeat(${rowPad + n}, var(--cell-size))`;
    this.boardEl.style.gridTemplateRows = `repeat(${colPad + n}, var(--cell-size))`;
    this.boardEl.classList.toggle('solved', this.solved || this.frozen);

    // top section: corner + col clues
    for (let r = 0; r < colPad; r += 1) {
      for (let c = 0; c < rowPad; c += 1) {
        this.boardEl.appendChild(el('div', { class: 'cell cell--corner' }));
      }
      for (let c = 0; c < n; c += 1) {
        const clue = cClues[c];
        const value = clue.length >= colPad - r ? clue[clue.length - (colPad - r)] : '';
        const classes = ['cell', 'cell--clue'];
        if (c === 0) classes.push('div-left');
        if (r === 0) classes.push('div-top');
        if ((c + 1) % 5 === 0 && c + 1 !== n) classes.push('div-right');
        if (r === colPad - 1) classes.push('div-bottom');
        this.boardEl.appendChild(el('div', { class: classes.join(' '), text: value === 0 ? '' : String(value) }));
      }
    }

    // body rows: row clues + cells
    for (let r = 0; r < n; r += 1) {
      const clue = rClues[r];
      for (let c = 0; c < rowPad; c += 1) {
        const value = clue.length >= rowPad - c ? clue[clue.length - (rowPad - c)] : '';
        const classes = ['cell', 'cell--clue'];
        if (r === 0) classes.push('div-top');
        if (c === rowPad - 1) classes.push('div-right');
        if ((r + 1) % 5 === 0 && r + 1 !== n) classes.push('div-bottom');
        this.boardEl.appendChild(el('div', { class: classes.join(' '), text: value === 0 ? '' : String(value) }));
      }
      for (let c = 0; c < n; c += 1) {
        const cell = el('div', {
          class: this.cellClasses(r, c),
          'data-r': r,
          'data-c': c,
        });
        cell.addEventListener('click', (ev) => this.handleLeftClick(ev, r, c));
        cell.addEventListener('contextmenu', (ev) => this.handleRightClick(ev, r, c));
        this.cellEls[r][c] = cell;
        this.boardEl.appendChild(cell);
      }
    }
  }

  cellClasses(r, c) {
    const v = this.userGrid[r][c];
    const classes = ['cell'];
    if (v === STATE.FILLED) classes.push('cell--filled');
    if (v === STATE.CROSS) classes.push('cell--cross');
    if (c === 0) classes.push('div-left');
    if (r === 0) classes.push('div-top');
    const n = this.size;
    if ((c + 1) % 5 === 0 && c + 1 !== n) classes.push('div-right');
    if ((r + 1) % 5 === 0 && r + 1 !== n) classes.push('div-bottom');
    return classes.join(' ');
  }

  updateCellVisual(r, c) {
    const node = this.cellEls[r] && this.cellEls[r][c];
    if (!node) return;
    node.className = this.cellClasses(r, c);
  }

  handleLeftClick(ev, r, c) {
    if (this.solved || this.frozen) return;
    const cur = this.userGrid[r][c];
    const next = cur === STATE.FILLED ? STATE.EMPTY : STATE.FILLED;
    this.userGrid[r][c] = next;
    if (next === STATE.FILLED) Sounds.fill();
    else Sounds.empty();
    this.afterChange(r, c);
  }

  handleRightClick(ev, r, c) {
    ev.preventDefault();
    if (this.solved || this.frozen) return;
    const cur = this.userGrid[r][c];
    const next = cur === STATE.CROSS ? STATE.EMPTY : STATE.CROSS;
    this.userGrid[r][c] = next;
    if (next === STATE.CROSS) Sounds.cross();
    else Sounds.empty();
    this.afterChange(r, c);
  }

  afterChange(r, c) {
    if (!this.timer.running && !this.solved && !this.frozen) {
      this.timer.start();
    }
    this.updateCellVisual(r, c);
    if (this.checkWin()) {
      this.handleWin();
    }
  }

  checkWin() {
    const target = this.template.grid;
    for (let r = 0; r < this.size; r += 1) {
      for (let c = 0; c < this.size; c += 1) {
        const targetFilled = target[r][c] === 1;
        const userFilled = this.userGrid[r][c] === STATE.FILLED;
        if (targetFilled !== userFilled) return false;
      }
    }
    return true;
  }

  handleWin() {
    this.solved = true;
    this.timer.stop();
    Sounds.win();
    const seconds = this.timer.seconds;
    const message = seconds > 0
      ? `Great! You have solved the nonogram in ${seconds} seconds!`
      : 'Great! You have solved the nonogram!';
    this.setMessage(message);
    this.boardEl.classList.add('solved');
    this.onWin({ seconds, template: this.template });
  }
}

export const CELL_STATE = STATE;
