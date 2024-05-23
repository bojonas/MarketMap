export function getLayoutIndex(layout) {
    const filteredLayout = layout.reduce((acc, curr) => {
        curr.forEach(item => {
          if (item.type !== 'empty') {
            acc.push(item);
          }
        });
        return acc;
    }, []);

    let layoutIndex = {};
    filteredLayout.forEach((item, index) => {
        const [row, col] = item.coordinates.split('-').map(Number);
        layoutIndex[row.toString() + col.toString()] = index;
    });
    return layoutIndex;
}