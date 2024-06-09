export function getLayoutIndex(layout) {
  const filteredLayout = layout.reduce((acc, curr) => {
      curr.forEach(cell => {
        if (cell.type !== 'empty') acc.push(cell);
      });
      return acc;
  }, []);
 
  let layoutIndex = {};
  filteredLayout.forEach((cell, index) => {
      const [row, col] = cell.coordinates.split('-').map(Number);
      layoutIndex[row.toString() + col.toString()] = index;
  });
  return layoutIndex;
}