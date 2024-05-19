export function findProducts(shoppingCart, layout) {
    if (!shoppingCart || !layout) return [];

    const products = [];
    for (const product of shoppingCart) {
        for (let i = 0; i < layout.length; i++) {
            for (let j = 0; j < layout[i].length; j++) {
                const cell = layout[i][j];
                const position = 'products' in cell ? cell.products.indexOf(product.product_id) : -1;
                const product_id = position >= 0 ? cell.products[position] : null;
                if (product_id) products.push({ row: i, column: j, product_id: product_id });
            }
        }
    }
    return products;
}
