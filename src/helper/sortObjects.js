export function sortObjects(object, order) {
  return object.sort((a, b) => {
      const indexA = order.indexOf(a.object);
      const indexB = order.indexOf(b.object);
      if (indexA === -1) return 1; 
      if (indexB === -1) return -1; 
      return indexA - indexB; 
    });
}