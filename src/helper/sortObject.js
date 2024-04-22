export function sortObject(object, order) {
  return object.sort((a, b) => {
    const indexA = order.indexOf(a.name);
    const indexB = order.indexOf(b.name);
    if (indexA === -1) return 1; 
    if (indexB === -1) return -1; 
    return indexA - indexB; 
  });
}