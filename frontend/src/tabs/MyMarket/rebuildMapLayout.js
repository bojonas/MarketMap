import { MapLayout } from "./classes/MapLayout";

function rebuildMapLayout(zones, map_layout) {
    // determine the size of the map layout based on the zones
    let maxRows = 0;
    let maxColumns = 0;
    for (const zone of zones) {
        const zoneBottomRightRow = zone.position.row + zone.layout.length;
        const zoneBottomRightColumn = zone.position.column + (zone.layout[0] ? zone.layout[0].length : 0);
        maxRows = Math.max(maxRows, zoneBottomRightRow);
        maxColumns = Math.max(maxColumns, zoneBottomRightColumn);
    }
    const mapLayout = new MapLayout(maxRows, maxColumns);

    // add each zone to the map layout
    for (const zone of zones) {
        mapLayout.addZone(zone.name, zone.layout, zone.position);
    }

    // add information about the cells that are not in a zone
    for (let i = 0; i < map_layout.length; i++) {
        for (let j = 0; j < map_layout[i].length; j++) {
            const cell = map_layout[i][j];
            if (cell && cell.zoneid) mapLayout.map_layout[i][j] = cell;
        }
    }
    return mapLayout;
}
