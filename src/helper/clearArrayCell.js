export function clearArrayCell(cords, newLayout, setNewLayout, setDroppedItem) {
    // remove item from cell
    const cord = cords.split('-');
    const updatedLayout = [...newLayout];
    updatedLayout[cord[0]][cord[1]]['type'] = 'empty';
    setNewLayout(updatedLayout);

    // reset dropped item
    setDroppedItem(null);
}