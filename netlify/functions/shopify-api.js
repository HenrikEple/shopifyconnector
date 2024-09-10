const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const shopifyToken = process.env.Shopify_test_token;
    const shopifyShop = 'eplehusettest';  // Replace with your actual Shopify store name

    try {
        const response = await fetch(`https://${shopifyShop}.myshopify.com/admin/api/2024-07/products.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': shopifyToken
            }
        });

        if (!response.ok) {
            throw new Error(`Shopify API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error occurred:', error);

        return {
            statusCode: 500,
            body: `Error: ${error.message}`
        };
    }
};