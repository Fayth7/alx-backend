const redis = require('redis');
const { promisify } = require('util');
const express = require('express');
const app = express();

// Connect to the Redis server
const client = redis.createClient();

// Get the current reserved stock for a specific item
const getCurrentReservedStockById = async (itemId) => {
    try {
        return await client.get(`item.${itemId}`);
    } catch (error) {
        console.error('Error getting current reserved stock:', error);
        return null;
    }
};

// Set the reserved stock for a specific item
const reserveStockById = (itemId, stock) => {
    client.set(`item.${itemId}`, stock);
};

// List of products
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Routes
app.get('/list_products', (req, res) => {
    const products = listProducts.map((product) => {
        return {
            ...product,
            currentQuantity: getCurrentReservedStockById(product.itemId) || product.initialAvailableQuantity,
        };
    });
    res.json(products);
});

app.get('/list_products/:itemId', (req, res) => {
    const product = listProducts.find((p) => p.itemId === parseInt(req.params.itemId));
    if (!product) {
        res.json({ status: 'Product not found' });
    } else {
        const currentStock = getCurrentReservedStockById(product.itemId);
        if (!currentStock) {
            res.json({ status: 'Product not found' });
        } else {
            const parsedStock = parseInt(currentStock);
            if (parsedStock < 1) {
                res.json({ status: 'Not enough stock available', itemId: product.itemId });
            } else {
                reserveStockById(product.itemId, parsedStock - 1);
                res.json({ status: 'Reservation confirmed', itemId: product.itemId });
            }
        }
    }
});

const PORT = 1245;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
