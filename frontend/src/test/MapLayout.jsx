import { Zone } from "./Zone";

export class MapLayout {
    constructor() {
      this.zones = new Map(); 
    }
  
    addZone(id, data, shape) {
      const zone = new Zone(id, data, shape);
      this.zones.set(id, zone);
    }
  
    removeZone(id) {
      const zone = this.zones.get(id);
      if (zone) {
        // disconnect from all neighbors
        zone.neighbors.forEach(neighbor => zone.disconnect(neighbor));
        this.zones.delete(id);
      }
    }
  
    connectZones(id1, id2) {
      const zone1 = this.zones.get(id1);
      const zone2 = this.zones.get(id2);
      if (zone1 && zone2) zone1.connect(zone2);
    }
  
    disconnectZones(id1, id2) {
      const zone1 = this.zones.get(id1);
      const zone2 = this.zones.get(id2);
      if (zone1 && zone2) zone1.disconnect(zone2);
    }
}
  