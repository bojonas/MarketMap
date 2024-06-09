import { Zone } from "./Zone";
import { Cell } from "./Cell";

export class MapLayout {
  constructor(rows, columns) {
    this.map_layout = Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(null, 'empty', i, j, [])));
    this.zones = new Map(); 
    this.idCounter = 0;
  }

  build (map_layout, zones) {
    for (const zone of zones) {
        this.addZone(zone.name, zone.layout, zone.position);
    }
    // add cells that are not in zone
    for (let i = 0; i < map_layout.length; i++) {
      for (let j = 0; j < map_layout[i].length; j++) {
        const cell = map_layout[i][j];
        if (typeof cell.zoneid === 'number') continue;
        if (!cell) {
          this.map_layout[i][j] = cell;
          continue;
        }
        this.map_layout[i][j].type = cell.type;
        this.map_layout[i][j].products = cell.type !== 'empty' ? cell.products : null;
      }
    }
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

  updateCoordinates() {
    if (this.map_layout.length === 0 || this.map_layout[0].length === 0) return;
    // update cell coordinates
    for (let i = 0; i < this.map_layout.length; i++) {
        for (let j = 0; j < this.map_layout[i].length; j++) {
          this.map_layout[i][j].x = i;
          this.map_layout[i][j].y = j;
        }
    }
  }

  addRow(side='bottom') {
    if (side !== 'top' && side !== 'bottom') return;
    const newRow = Array.from({length: this.map_layout[0].length}, () => ({ type: 'empty', coordinates: '' }));
    if (side === 'top') this.map_layout.unshift(newRow);
    else this.map_layout.push(newRow);
    this.updateCoordinates(this.map_layout);
  }

  addColumn(side='right') {
    if (side !== 'left' && side !== 'right') return;
    for (let i = 0; i < this.map_layout.length; i++) {
      if (side === 'left')  this.map_layout[i].unshift({ type: 'empty' });
      else  this.map_layout[i].push({ type: 'empty' });
    }
    this.updateCoordinates(this.map_layout);
  } 
  
  removeRow(side='bottom') {
    if ((side !== 'top' && side !== 'bottom') || this.map_layout.length <= 1) return;
    if (side === 'top') this.map_layout.shift();
    else this.map_layout.pop();
    this.updateCoordinates(this.map_layout);
  }

  removeColumn(side='right') {
    if ((side !== 'left' && side !== 'right') || this.map_layout[0].length <= 1) return;
    for (let i = 0; i < this.map_layout.length; i++) { 
      if (side === 'left') this.map_layout[i].shift();
      else this.map_layout[i].pop();
    }
    this.updateCoordinates(this.map_layout);
  }
}