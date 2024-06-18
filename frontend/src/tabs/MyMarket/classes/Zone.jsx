import { Cell } from '../classes/Cell';

export class Zone {
    constructor(zone_id, zone_name, zone_layout, zone_position, zone_color) {
        this.zone_id = zone_id;
        this.zone_name = zone_name;
        this.zone_layout = zone_layout;
        this.zone_position = zone_position; 
        this.zone_color = zone_color;
        this.rows = zone_layout.length;
        this.columns = this.rows > 0 ? zone_layout[0].length : 0;
    }

    updateLayout(overlappingLayout, overlappingPosition) {
        for (let i = 0; i < overlappingLayout.length; i++) {
            for (let j = 0; j < overlappingLayout[i].length; j++) {
                const row = overlappingPosition.row + i - this.zone_position.row;
                const col = overlappingPosition.column + j - this.zone_position.column;
                if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) continue;

                const cell = overlappingLayout[i][j];
                if (typeof cell.zone_id === 'number') this.zone_layout[row][col] = new Cell(null, cell.type, cell.x, cell.y, cell.products || null, cell.rotation || null);
            }
        }
        this.rows = this.zone_layout.length;
        this.columns = this.rows > 0 ? this.zone_layout[0].length : 0;
    }    

}