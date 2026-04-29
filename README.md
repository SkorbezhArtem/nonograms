# Nonograms

Classic binary nonograms puzzle game implemented in vanilla HTML, CSS and
JavaScript. No frameworks, no jQuery, no `alert`/`prompt`/`confirm`.

**Live demo:** https://skorbezhartem.github.io/nonograms/

**Task:** [RSS Nonograms](https://github.com/rolling-scopes-school/tasks/blob/fce6d6aa1de9464c32de51a1849efad62652a2e3/tasks/nonograms/README.md)

## Run locally

```bash
git clone https://github.com/SkorbezhArtem/nonograms.git
cd nonograms
python3 -m http.server 8080   # or: npx http-server . -p 8080
```

then open http://localhost:8080.

## Implemented requirements

### Basic

- [x] `body` in `index.html` is empty (only the `<script>` tag); all DOM is
      generated in JS.
- [x] Responsive layout from 500px width — elements scale proportionally
      without abrupt switching, no hidden / off-screen content. The app is
      in English.
- [x] Default field size is 5x5. Clues are placed at the top and left side
      of the grid; sequences are arranged so the puzzle is logically
      solvable. No nonograms with empty rows / columns.
- [x] Every 5 cells in rows and columns are separated by a thicker divider,
      both inside the field and inside the clue strips. Clues are also
      separated from the game field by a bold line.
- [x] Left mouse-click toggles a cell between empty and dark. Clicking a
      dark cell turns it back to empty.
- [x] When the player fills exactly the cells described by the clues, the
      board freezes and a success message is shown:
      _"Great! You have solved the nonogram!"_ (or the timed variant —
      see below).

### Advanced

- [x] **5 templates per difficulty** (15 total): players pick a picture
      from a labelled dropdown.
- [x] **Right-click cross (X)** marking. The native context menu is
      suppressed. Crosses are not required to win.
- [x] **Reset game** button — clears the board without changing the level
      / template and without reloading the page.
- [x] **Stopwatch** in `mm:ss` format. Starts on the first click on the
      field (left or right), stops on win. The success message becomes
      _"Great! You have solved the nonogram in N seconds!"_.
- [x] **Sound effects** for filling a cell, marking with X, clearing a
      cell and winning. A global Mute button toggles them off.
- [x] **Save game / Continue last game** via `localStorage`. Crossed
      cells and the timer are part of the saved staging.

### Additional

- [x] **Light / Dark theme** — full color scheme switch (background,
      cells, clues, buttons, scores).
- [x] **Three difficulty levels**: Easy 5x5, Medium 10x10, Hard 15x15,
      each with its own pictures.
- [x] **Top-5 high scores** in `localStorage`, sorted by time. Each row
      shows template name, difficulty and `mm:ss`.
- [x] **Random game** button — picks a random template + level different
      from the current one.
- [x] **Solution** button — fills the field with the correct dark cells.
      Ends the current game without recording a win.

## Technical notes

- ES modules, no bundler — runs straight from the filesystem / any static
  server.
- All game data (levels, templates, settings, scores, save) is local —
  the app works fully offline once loaded.
- Right-click context menu is suppressed both globally on the board and
  per-cell.

## Project structure

```
index.html
src/
  css/style.css         Theme variables + responsive layout
  js/
    app.js              Entry point: builds DOM, wires controls
    game.js             Core Game class (render, clicks, win check)
    clues.js            Compute row / column run-length clues
    timer.js            Stopwatch + mm:ss formatter
    sounds.js           Tiny WebAudio synth (no asset files needed)
    storage.js          localStorage helpers
    ui.js               Tiny `el(...)` DOM helper
    data/templates.js   15 puzzles (5 per difficulty)
```
