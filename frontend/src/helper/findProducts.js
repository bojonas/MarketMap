export function findProducts(layout) {
    if (!layout) return [];

    const products = [];
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            const cell = layout[i][j];
            if (!('products' in cell)) continue;

            for (const product_id of cell.products) {
                products.push({ row: i, column: j, product_id: product_id });
            }
        }
    }
    return products;
}