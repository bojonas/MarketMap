import { Zone } from "./Zone";
import { Cell } from "./Cell";

export class MapLayout {
  constructor(rows, columns) {
    this.map_layout = Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(null, 'empty', i, j, null, null)));
    this.zones = new Map(); 
    this.idCounter = 0;
  }

  build (map_layout, zones) {
    if (zones && zones.length) this.idCounter = zones[0].zone_id;
    for (const zone of zones) {
      this.addZone(zone.zone_id, zone.zone_name, zone.zone_layout, zone.zone_position, zone.zone_color);
    }
    // add cells that are not in zone
    for (let i = 0; i < map_layout.length; i++) {
      for (let j = 0; j < map_layout[i].length; j++) {
        const cell = map_layout[i][j];
        if (typeof cell.zone_id === 'number') continue;
        if (!cell) {
          this.map_layout[i][j] = cell;
          continue;
        }
        this.map_layout[i][j].type = cell.type;
        this.map_layout[i][j].products = cell.type !== 'empty' ? cell.products : null;
        this.map_layout[i][j].rotation = cell.rotation || null;
      }
    }
    if (zones && zones.length) this.idCounter = zones[zones.length-1].zone_id + 1;
  }
  
  getZone(zone_id) {
    return this.zones.get(zone_id);
  }

  addZone(zone_id=null, zone_name, zone_layout, zone_position, zone_color) {
    if (!zone_id) zone_id = this.idCounter++;
    const newZone = new Zone(zone_id, zone_name, zone_layout, zone_position, zone_color);
    for (const zone of this.zones.values()) {
      zone.updateLayout(zone_layout, zone_position);
      if (!zone.zone_layout.some(row => row.some(cell => typeof cell.zone_id === 'number'))) this.removeZone(zone.zone_id);
    }
    this.zones.set(zone_id, newZone);
    this.updateMapLayout(newZone);
    return newZone;
  }

  removeZone(zone_id) {
    const zoneToRemove = this.zones.get(zone_id);
    if (!zoneToRemove) return;
    this.zones.delete(zone_id);
    this.recreateMapLayout();
  }

  swapZones(zone_id1, zone_id2) {
    const zone1 = this.zones.get(zone_id1);
    const zone2 = this.zones.get(zone_id2);
    if (!zone1 || !zone2) return;
    const newZone1 = new Zone(zone2.zone_id, zone1.zone_name, zone1.zone_layout, zone1.zone_position, zone1.zone_color);
    const newZone2 = new Zone(zone1.zone_id, zone2.zone_name, zone2.zone_layout,  zone1.zone_position, zone2.zone_color);
    this.zones.set(zone_id2, newZone1);
    this.zones.set(zone_id1, newZone2);
    this.recreateMapLayout();
  }

  updateMapLayout(zone) {
    for (let i = 0; i < zone.zone_layout.length; i++) {
        for (let j = 0; j < zone.zone_layout[i].length; j++) {
          const cell = zone.zone_layout[i][j];
          if (typeof cell.zone_id !== 'number') continue;

          const x = zone.zone_position.row + i;
          const y = zone.zone_position.column + j;
          if (this.map_layout.length <= x || this.map_layout[0].length <= y) continue;

          this.map_layout[x][y] = new Cell(cell.zone_id, cell.type, cell.x, cell.y, cell.products, cell.rotation);
        }
    }
  }

  recreateMapLayout() {
    this.map_layout = Array(this.map_layout.length).fill().map((_, i) => Array(this.map_layout[0].length).fill().map((_, j) => new Cell(null, 'empty', i, j, null, null)));
    for (const zone of this.zones.values()) {
      this.updateMapLayout(zone);
    }
  }

  setZoneColor(zone_id, color) {
    const zone = this.zones.get(zone_id);
    if (zone) this.zones.set(zone_id, new Zone(zone_id, zone.zone_name, zone.zone_layout, zone.zone_position, color));
  }
}