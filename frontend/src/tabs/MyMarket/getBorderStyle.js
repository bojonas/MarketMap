export function getBorderStyle(borderInZone, x, y) {
    let borderStyle = {};
    for (let borderCell of borderInZone.border) {
        if (borderCell.x !== x || borderCell.y !== y) continue;
        for (let direction of borderCell.direction) {
            if (direction === 'top') {
                borderStyle.borderTopColor = borderInZone.color;
                borderStyle.borderTopLeftRadius = 0;
                borderStyle.borderTopRightRadius = 0;
            }
            if (direction === 'bottom') {
                borderStyle.borderBottomColor = borderInZone.color;
                borderStyle.borderBottomLeftRadius = 0;
                borderStyle.borderBottomRightRadius = 0;
            }
            if (direction === 'left') {
                borderStyle.borderLeftColor = borderInZone.color;
                borderStyle.borderTopLeftRadius = 0;
                borderStyle.borderBottomLeftRadius = 0;
            }
            if (direction === 'right') { 
                borderStyle.borderRightColor = borderInZone.color;
                borderStyle.borderTopRightRadius = 0;
                borderStyle.borderBottomRightRadius = 0;
            }                                                    
        } break;
    } return borderStyle;
}