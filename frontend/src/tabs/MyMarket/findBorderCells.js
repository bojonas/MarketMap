export function findBorderCells(grid) {
    let borderCells = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (typeof grid[i][j].zone_id == 'number') {
                let direction = [];
                if (i - 1 < 0 || grid[i - 1][j].zone_id !== grid[i][j].zone_id) direction.push('top');
                if (i + 1 >= grid.length || grid[i + 1][j].zone_id !== grid[i][j].zone_id) direction.push('bottom');
                if (j - 1 < 0 || grid[i][j - 1].zone_id !== grid[i][j].zone_id) direction.push('left');
                if (j + 1 >= grid[i].length || grid[i][j + 1].zone_id !== grid[i][j].zone_id) direction.push('right');
                if (direction.length > 0) borderCells.push({ x: grid[i][j].x, y: grid[i][j].y, direction: direction });
            }
        }
    }
    return borderCells;
}