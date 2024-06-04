import { Zone } from "./Zone";
export class MapLayout {
  constructor() {
    this.zones = new Map(); 
    this.idCounter = 0;
  }

  addZone(name, layout) {
    const id = this.idCounter++;
    const zone = new Zone(id, name, layout);
    this.zones.set(id, zone);
  }

  removeZone(id) {
    const zone = this.zones.get(id);
    if (zone) this.zones.delete(id);
  }

  swapZones(id1, id2) {
    const zone1 = this.zones.get(id1);
    const zone2 = this.zones.get(id2);
  
    if (!zone1 || !zone2) return;
    const newZone1 = new Zone(zone2.id, zone1.name, zone1.layout, zone1.color);
    const newZone2 = new Zone(zone1.id, zone2.name, zone2.layout, zone2.color);
    this.zones.set(id2, newZone1);
    this.zones.set(id1, newZone2);
  }
  
}