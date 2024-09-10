const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const shopifyToken = process.env.Shopify_test_token; // Your Shopify API token as an environment variable
    const shopifyStore = 'eplehusettest'; // Replace with your actual Shopify store URL

    // Parse the body of the request to get the product variant ID and quantity
    const { id, quantity } = JSON.parse(event.body);

    try {
        const response = await fetch(`https://${shopifyStore}.myshopify.com/admin/api/2024-07/carts.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': shopifyToken,
            },
            body: JSON.stringify({
                id: id,
                quantity: quantity
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to add product to cart' }),
        };
    }
};