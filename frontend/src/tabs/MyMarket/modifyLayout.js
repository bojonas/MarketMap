function updateCoordinates(layout) {
  if (layout.length === 0 || layout[0].length === 0) return;
  // update cell coordinates
  for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        layout[i][j].x = i;
        layout[i][j].y = j;
      }
  }
}

function updateZoneCoordinates(layout, zonePosition) {
  if (layout.length === 0 || layout[0].length === 0) return;
  // update cell coordinates
  for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        layout[i][j].x = i + zonePosition.row;
        layout[i][j].y = j + zonePosition.column;
      }
  }
}

export function addRow (layout, side='bottom') {
    if (side !== 'top' && side !== 'bottom') return;
    const newRow = Array.from({length: layout[0].length}, () => ({ type: 'empty', coordinates: '' }));
    if (side === 'top') layout.unshift(newRow);
    else layout.push(newRow);
    updateCoordinates(layout);
}

export function addColumn (layout, side='right') {
  if (side !== 'left' && side !== 'right') return;
  for (let i = 0; i < layout.length; i++) {
    if (side === 'left')  layout[i].unshift({ type: 'empty' });
    else layout[i].push({ type: 'empty' });
  }
  updateCoordinates(layout);
} 
  
export function removeRow (layout, zonePosition, side='bottom') {
  if ((side !== 'top' && side !== 'bottom') || layout.length <= 1) return;
  if (side === 'top') layout.shift();
  else layout.pop();

  if (zonePosition) updateZoneCoordinates(layout, zonePosition);
  else updateCoordinates(layout);
}

export function removeColumn(layout, zonePosition, side='right') {
  if ((side !== 'left' && side !== 'right') || layout[0].length <= 1) return;
  for (let i = 0; i < layout.length; i++) { 
    if (side === 'left') layout[i].shift();
    else layout[i].pop();
  }
  if (zonePosition) updateZoneCoordinates(layout, zonePosition);
  else updateCoordinates(layout);
}