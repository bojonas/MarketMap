export function getWaypoints(productsInMarket, shoppingCart) {
    const coordinates = new Set();
    productsInMarket.forEach(productInMarket => {
        if (shoppingCart.products.some(cartProduct => cartProduct.product_id === productInMarket.product_id)) {
            coordinates.add(JSON.stringify([productInMarket.row, productInMarket.column]));
        }
    });
    return Array.from(coordinates).map(JSON.parse);
}