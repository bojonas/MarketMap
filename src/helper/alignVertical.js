// function to determine if item should be turned 90deg to align vertically
export function alignVertical(layout, cellId) {
    const [row, col] = cellId.split('-').map(Number);
    const rowEnd = layout.length-1;
    const colEnd = layout[row].length-1;
    if (row < rowEnd && layout[row+1][col]['type'] !== 'empty') {
        if ((col < colEnd && layout[row][col+1]['type'] === 'empty') && (col > 0 && layout[row][col-1]['type'] === 'empty')) return true;
    }
    if (row > 0 && layout[row-1][col]['type'] !== 'empty') {
        if ((col < colEnd && layout[row][col+1]['type'] === 'empty') && (col > 0 && layout[row][col-1]['type'] === 'empty')) return true;
    }
    return false;
}