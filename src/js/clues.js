// Compute clues from a binary grid.
// rows clues: list of run-lengths for each row, left to right.
// cols clues: list of run-lengths for each column, top to bottom.

export function rowClues(grid) {
  return grid.map((row) => runs(row));
}

export function colClues(grid) {
  if (!grid.length) return [];
  const n = grid[0].length;
  const result = [];
  for (let c = 0; c < n; c += 1) {
    const col = grid.map((r) => r[c]);
    result.push(runs(col));
  }
  return result;
}

function runs(line) {
  const out = [];
  let count = 0;
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === 1) {
      count += 1;
    } else if (count) {
      out.push(count);
      count = 0;
    }
  }
  if (count) out.push(count);
  return out.length ? out : [0];
}

export function maxRowClueLength(rowCluesArr) {
  return rowCluesArr.reduce((m, c) => Math.max(m, c.length), 0);
}

export function maxColClueLength(colCluesArr) {
  return colCluesArr.reduce((m, c) => Math.max(m, c.length), 0);
}
