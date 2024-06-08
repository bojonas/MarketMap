import { Zone } from "./Zone";
import { Cell } from "./Cell";

export class MapLayout {
  constructor(rows, columns) {
    this.map_layout =  Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(null, 'empty', i, j, [])));
    this.zones = new Map(); 
    this.idCounter = 0;
  }
  
  getZone(id) {
    return this.zones.get(id);
  }

  addZone(name, layout, position, color) {
    const id = this.idCounter++;
    const newZone = new Zone(id, name, layout, position, color);
    for (let zone of this.zones.values()) {
      zone.updateLayout(layout, position);
      if (!zone.layout.some(row => row.some(cell => typeof cell.zoneid !== 'number'))) this.removeZone(zone.id);
    }
    this.zones.set(id, newZone);
    this.updateMapLayout(newZone);
  }

  removeZone(id) {
    if (!this.zones.get(id)) return;
    this.zones.delete(id);
    this.recreateMapLayout();
  }

  swapZones(id1, id2) {
    const zone1 = this.zones.get(id1);
    const zone2 = this.zones.get(id2);
    if (!zone1 || !zone2) return;
    const newZone1 = new Zone(zone2.id, zone1.name, zone1.layout, zone1.color);
    const newZone2 = new Zone(zone1.id, zone2.name, zone2.layout, zone2.color);
    this.zones.set(id2, newZone1);
    this.zones.set(id1, newZone2);
    this.recreateMapLayout();
  }

  updateMapLayout(zone) {
    for (let i = 0; i < zone.layout.length; i++) {
        for (let j = 0; j < zone.layout[i].length; j++) {
          const cell = zone.layout[i][j];
          if (typeof cell.zoneid !== 'number') continue;
          this.map_layout[zone.position.row + i][zone.position.column + j] = new Cell(cell.zoneid, cell.type, cell.x, cell.y, cell.products);
        }
    }
  }

  recreateMapLayout() {
    this.map_layout = Array(this.map_layout.length).fill().map((_, i) => Array(this.map_layout[0].length).fill().map((_, j) => new Cell(null, 'empty', i, j, [])));
    for (let zone of this.zones.values()) {
      this.updateMapLayout(zone);
    }
  }
}