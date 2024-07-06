/* 
function to recalculate index in map layout without empty cells for
color highlighting cells containing products 
*/
export function getLayoutIndex(layout) {
  const filteredLayout = layout.reduce((acc, curr) => {
      curr.forEach(cell => {
        if (cell.type !== 'empty') acc.push(cell);
      });
      return acc;
  }, []);
 
  let layoutIndex = {};
  filteredLayout.forEach((cell, index) => {
      layoutIndex[cell.x.toString() + cell.y.toString()] = index;
  });
  return layoutIndex;
}