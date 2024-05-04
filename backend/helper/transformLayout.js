function transformLayout(arr) {
    const map = new Map(arr.map(obj => [obj.coordinates, obj]));

    // define dimensions
    const dimensions = arr.reduce((dims, obj) => {
        const [row, col] = obj.coordinates.split('-').map(Number);
        return [Math.max(dims[0], row + 1), Math.max(dims[1], col + 1)];
    }, [0, 0]);

    const result = Array.from({ length: dimensions[0] }, () => Array(dimensions[1]).fill(null));

    // add data
    for (let i = 0; i < dimensions[0]; i++) {
        for (let j = 0; j < dimensions[1]; j++) {
            const key = `${i}-${j}`;
            result[i][j] = map.has(key) ? map.get(key) : { coordinates: key, type: 'empty' };
        }
    }

    return result;
}

module.exports = transformLayout;