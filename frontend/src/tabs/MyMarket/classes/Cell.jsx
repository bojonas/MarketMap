export class Cell {
    constructor(zone_id, type, x, y, products, rotation) {
        this.zone_id = zone_id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.products = products;
        this.rotation = rotation;
    }
}