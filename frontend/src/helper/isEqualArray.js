export function isEqualArray(a, b) {
    if (a[0] === undefined || b[0] === undefined) return false;
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}