// Each template's grid is described as an array of strings:
//   "#" — filled cell, "." — empty cell.
// All templates are validated: no empty rows / no empty columns.

const parse = (rows) => rows.map((line) => line.split('').map((c) => (c === '#' ? 1 : 0)));

const easy = [
  {
    id: 'heart',
    name: 'Heart',
    difficulty: 'easy',
    size: 5,
    grid: parse([
      '.#.#.',
      '#####',
      '#####',
      '.###.',
      '..#..',
    ]),
  },
  {
    id: 'plus',
    name: 'Plus',
    difficulty: 'easy',
    size: 5,
    grid: parse([
      '..#..',
      '..#..',
      '#####',
      '..#..',
      '..#..',
    ]),
  },
  {
    id: 'arrow',
    name: 'Arrow',
    difficulty: 'easy',
    size: 5,
    grid: parse([
      '..#..',
      '.##..',
      '#####',
      '.##..',
      '..#..',
    ]),
  },
  {
    id: 'house',
    name: 'House',
    difficulty: 'easy',
    size: 5,
    grid: parse([
      '..#..',
      '.###.',
      '#####',
      '#.#.#',
      '#####',
    ]),
  },
  {
    id: 'smile',
    name: 'Smile',
    difficulty: 'easy',
    size: 5,
    grid: parse([
      '#...#',
      '#...#',
      '..#..',
      '#...#',
      '.###.',
    ]),
  },
];

export const ALL_TEMPLATES = [...easy];

export const BY_DIFFICULTY = {
  easy,
};

export const DIFFICULTY_LABELS = {
  easy: 'Easy (5x5)',
};

export const DIFFICULTIES = ['easy'];

export function findTemplate(id) {
  return ALL_TEMPLATES.find((t) => t.id === id) || null;
}
