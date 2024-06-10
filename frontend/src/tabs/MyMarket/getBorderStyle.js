export function getBorderStyle(borderStyle, borderInZone, x, y) {    
    for (const borderCell of borderInZone.border) {
        if (borderCell.x !== x || borderCell.y !== y) continue;
        for (const direction of borderCell.direction) {
            if (direction === 'top') {
                borderStyle.borderTopColor = `rgb(${borderInZone.zone_color})`;
                borderStyle.borderTopLeftRadius = 0;
                borderStyle.borderTopRightRadius = 0;
            }
            if (direction === 'bottom') {
                borderStyle.borderBottomColor = `rgb(${borderInZone.zone_color})`;
                borderStyle.borderBottomLeftRadius = 0;
                borderStyle.borderBottomRightRadius = 0;
            }
            if (direction === 'left') {
                borderStyle.borderLeftColor = `rgb(${borderInZone.zone_color})`;
                borderStyle.borderTopLeftRadius = 0;
                borderStyle.borderBottomLeftRadius = 0;
            }
            if (direction === 'right') { 
                borderStyle.borderRightColor = `rgb(${borderInZone.zone_color})`;
                borderStyle.borderTopRightRadius = 0;
                borderStyle.borderBottomRightRadius = 0;
            } 
        } break;
    } 
    return borderStyle;
}