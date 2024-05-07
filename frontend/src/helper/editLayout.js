export function addRow(layout, side) {
    if (side === 'top' || side === 'bottom') {
        const newRow = Array.from({length: layout[0].length}, () => ({ type: 'empty', coordinates: '' }));
        if (side === 'top') {
            layout.unshift(newRow);
        } else {
            layout.push(newRow);
        }
    }
    return updateCoordinates(layout);
};

export function addColumn(layout, side) {
    if (side === 'left' || side === 'right') {
        for (let i = 0; i < layout.length; i++) {
            if (side === 'left') {
                layout[i].unshift({ type: 'empty' });
            } else {
                layout[i].push({ type: 'empty' });
            }
        }
    }
    return updateCoordinates(layout);
};  


export function removeRow(layout, side) {
    if (layout.length <= 1) return layout;
    if (side === 'top' || side === 'bottom') {
        if (layout.length > 0) { 
            if (side === 'top') {
                layout.shift();
            } else {
                layout.pop();
            }
        }
    }
    return updateCoordinates(layout);
};

export function removeColumn(layout, side) {
    if (layout[0].length <= 1) return layout;
    if (side === 'left' || side === 'right') {
        for (let i = 0; i < layout.length; i++) {
            if (layout[i].length > 0) { 
                if (side === 'left') {
                    layout[i].shift();
                } else {
                    layout[i].pop();
                }
            }
        }
    }
    return updateCoordinates(layout);
};

function updateCoordinates(layout) {
    if (layout.length === 0 || layout[0].length === 0) return;
    // update cell coordinates
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            layout[i][j].coordinates = `${i}-${j}`;
        }
    }
    return layout;
}