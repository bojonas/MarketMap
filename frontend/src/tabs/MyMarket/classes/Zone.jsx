export class Zone {
    constructor(id, name, layout, position, color) {
        this.id = id;
        this.name = name;
        this.layout = layout;
        this.position = position; 
        this.color = color;
        this.rows = layout.length;
        this.columns = this.rows > 0 ? layout[0].length : 0;
    }

    updateLayout(overlappingLayout, overlappingPosition) {
        for (let i = 0; i < overlappingLayout.length; i++) {
            for (let j = 0; j <overlappingLayout[i].length; j++) {
                const row = overlappingPosition.row + i - this.position.row;
                const col = overlappingPosition.column + j - this.position.column;
                if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
                    if (typeof overlappingLayout[i][j] === 'number') this.layout[row][col] = true;
                }
            }
        }
        this.rows = this.layout.length;
        this.columns = this.rows > 0 ? this.layout[0].length : 0;
    }    
}