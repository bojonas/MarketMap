function getStartandEnd(layout, waypoints, start, end) {
    let entry = start ? { dist: 0, cell: start } : { dist: Infinity, cell: [0, 0] };
    let checkout = end ? { dist: 0, cell: end } : { dist: Infinity, cell: [layout.length-1, 0] };

    for(let row = 0; row < layout.length; row++) {
        for(let col = 0; col < layout[row].length; col++) {
            const cell = layout[row][col];
            if ((cell.type === 'entry' && !start) || (cell.type === 'checkout' && !end)) {
                let minDist = Infinity;
                if (waypoints.length !== 0) {
                    for (let waypoint of waypoints) {
                        const dist = Math.hypot(row - waypoint[0], col - waypoint[1]);
                        if (dist < minDist) {
                            minDist = dist;
                        }
                    }
                } else {
                    for(let row2 = 0; row2 < layout.length; row2++) {
                        for(let col2 = 0; col2 < layout[row2].length; col2++) {
                            const cell2 = layout[row2][col2];
                            if ((cell.type === 'entry' && cell2.type === 'checkout') || (cell.type === 'checkout' && cell2.type === 'entry')) {
                                const dist = Math.hypot(row - row2, col - col2);
                                if (dist < minDist) {
                                    minDist = dist;
                                }
                            }
                        }
                    }
                }

                if (cell.type === 'entry' && minDist < entry.dist) {
                    entry.dist = minDist;
                    entry.cell = [row, col];
                }
                else if (cell.type === 'checkout' && minDist < checkout.dist) {
                    checkout.dist = minDist;
                    checkout.cell = [row, col];
                }
            }
        }
    }

    return [entry.cell, checkout.cell];
}

module.exports = getStartandEnd;