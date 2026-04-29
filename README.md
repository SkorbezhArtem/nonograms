# Nonograms

Classic binary nonograms puzzle game. Pure HTML/CSS/JS, no frameworks.

## Run

Just open `index.html` in a modern browser, or serve the folder:

```bash
npx http-server . -p 8080
```

then open `http://localhost:8080`.

## Features

- Three difficulty levels: easy (5x5), medium (10x10), hard (15x15)
- 5 templates per difficulty (15 total)
- Left click — fill cell, right click — cross cell
- Stopwatch (mm:ss), starts on first cell click, stops on win
- Reset, Save / Continue last game (localStorage)
- Random game button, Solution button
- Top-5 high scores per session (localStorage)
- Light / Dark theme
- Sound effects with global mute
- Responsive from 500px width
