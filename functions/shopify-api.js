const fetch = require('node-fetch');

exports.handler = async function() {
    const shopifyToken = process.env.Shopify_test_token;
    const shopifyShop = 'youeplehusettest';

    const response = await fetch(`https://${shopifyShop}/admin/api/2024-07/products.json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopifyToken
        }
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};