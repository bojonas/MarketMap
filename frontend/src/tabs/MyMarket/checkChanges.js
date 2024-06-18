export function checkChanges(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;
        for (let j = 0; j < a[i].length; j++) {
            if (
                a[i][j].type !== b[i][j].type || 
                a[i][j].x !== b[i][j].x || 
                a[i][j].y !== b[i][j].y ||
                a[i][j].zone_id !== b[i][j].zone_id ||
                !arraysEqual(a[i][j].products, b[i][j].products) ||
                a[i][j].rotation !== b[i][j].rotation
            ) return false;
        }
    }
    return true;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    for (let i = 0; i < sortedA.length; ++i) {
        if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
}
