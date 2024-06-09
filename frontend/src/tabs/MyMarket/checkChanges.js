export function checkChanges(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;
        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j].type !== b[i][j].type || a[i][j].x !== b[i][j].x || a[i][j].y !== b[i][j].y) return false;
        }
    }
    return true;
}