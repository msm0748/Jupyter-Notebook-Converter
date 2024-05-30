interface NbData {
  cells: Cell[];
}

interface Cell {
  cell_type: 'markdown' | 'code';
  source: string[];
  outputs: Output[];
}

interface Output {
  data: { [key: string]: string };
}
