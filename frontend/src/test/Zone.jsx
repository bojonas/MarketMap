export class Zone {
    constructor(id, shape, data) {
        this.id = id;
        this.shape = shape;
        this.data = data; 
        this.neighbors = [];
    }

    // connect zone to another
    connect(otherZone) {
        this.neighbors.push(otherZone);
        otherZone.neighbors.push(this);
    }

    // disconnect zone from another
    disconnect(otherZone) {
        this.neighbors = this.neighbors.filter(zone => zone.id !== otherZone.id);
        otherZone.neighbors = otherZone.neighbors.filter(zone => zone.id !== this.id);
    }
}