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

function updateCoordinates(layout) {
    // update cell coordinates
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            layout[i][j].coordinates = `${i}-${j}`;
        }
    }
    return layout;
}