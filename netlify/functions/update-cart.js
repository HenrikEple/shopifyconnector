
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const shopifyStorefrontToken = process.env.Shopify_storefront_token; // Your Storefront API token
    const shopifyStore = 'eplehusettest'; // Replace with your actual Shopify store URL
    const graphqlEndpoint = `https://${shopifyStore}.myshopify.com/admin/api/2024-07/carts.json`;

    const { id, quantity } = JSON.parse(event.body);

    // GraphQL query to add items to the checkout (equivalent to a cart)
    const query = `
        mutation {
            checkoutCreate(input: {
                lineItems: [
                    {
                        variantId: "${id}",
                        quantity: ${quantity}
                    }
                ]
            }) {
                checkout {
                    id
                    webUrl
                    lineItems(first: 5) {
                        edges {
                            node {
                                title
                                quantity
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken,
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Shopify Storefront API Error: ${errorText}`);
            throw new Error(`Failed to add product to checkout`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error occurred:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};