import { Cell } from '../classes/Cell';

export class Zone {
    constructor(zone_id, zone_name, zone_layout, zone_position, zone_color) {
        this.zone_id = zone_id;
        this.zone_name = zone_name;
        this.zone_layout = zone_layout;
        this.zone_position = zone_position; 
        this.zone_color = zone_color;
        this.rows = zone_layout.length;
        this.columns = this.rows ? zone_layout[0].length : 0;
    }

    updateLayout(overlappingLayout, overlappingPosition) {
        if (overlappingLayout && overlappingPosition) {
            // remove cells that are now belong to another zone
            for (let i = 0; i < overlappingLayout.length; i++) {
                for (let j = 0; j < overlappingLayout[i].length; j++) {
                    const row = overlappingPosition.row + i - this.zone_position.row;
                    const col = overlappingPosition.column + j - this.zone_position.column;
                    if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) continue;

                    const cell = overlappingLayout[i][j];
                    if (typeof cell.zone_id === 'number') this.zone_layout[row][col] = new Cell(null, cell.type, cell.x, cell.y, cell.products || null, cell.rotation || null);
                }
            }
        }

        // remove not selected rows and columns
        let rowsToKeep = new Set();
        let colsToKeep = new Set();
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (typeof this.zone_layout[i][j].zone_id !== 'number') continue;
                rowsToKeep.add(i);
                colsToKeep.add(j);
            }
        }
        this.zone_layout = this.zone_layout.filter((_, i) => rowsToKeep.has(i));
        this.zone_layout = this.zone_layout.map(row => row.filter((_, j) => colsToKeep.has(j))); 

        // recalculate values
        this.rows = this.zone_layout.length;
        this.columns = this.rows ? this.zone_layout[0].length : 0;
        if (this.zone_layout.length === 0) return;

        const firstCell = this.zone_layout[0][0];
        this.zone_position = { row: firstCell.x, column: firstCell.y }
    }
}