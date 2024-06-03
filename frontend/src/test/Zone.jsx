export class Zone {
    constructor(id, name, layout, color) {
        this.id = id;
        this.name = name;
        this.layout = layout;
        this.color = color;
        this.rows = layout.length;
        this.columns = this.rows > 0 ? layout[0].length : 0;
    }
}