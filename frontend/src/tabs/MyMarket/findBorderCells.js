export function findBorderCells(grid) {
    let borderCells = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (typeof grid[i][j].zoneid == 'number') {
                let direction = [];
                if (i - 1 < 0 || typeof grid[i - 1][j].zoneid !== 'number') direction.push('top');
                if (i + 1 >= grid.length || typeof grid[i + 1][j].zoneid !== 'number') direction.push('bottom');
                if (j - 1 < 0 || typeof grid[i][j - 1].zoneid !== 'number') direction.push('left');
                if (j + 1 >= grid[i].length || typeof grid[i][j + 1].zoneid !== 'number') direction.push('right');
                if (direction.length > 0) borderCells.push({ x: grid[i][j].x, y: grid[i][j].y, direction: direction });
            }
        }
    }
    return borderCells;
}
