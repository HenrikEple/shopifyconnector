const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const shopifyStorefrontToken = process.env.Shopify_storefront_token; // Your Storefront API token
    const shopifyStore = 'eplehusettest.myshopify.com'; // Replace with your actual Shopify store URL
    const graphqlEndpoint = `https://${shopifyStore}/api/2023-01/graphql.json`;

    // Parse the request body to get the variant ID and quantity
    const { id, quantity } = JSON.parse(event.body);

    // Convert the numeric variant ID to a global ID (Base64 encoded)
    const globalVariantId = Buffer.from(`gid://shopify/ProductVariant/${id}`).toString('base64');

    const query = `
        mutation checkoutCreate($input: CheckoutCreateInput!) {
            checkoutCreate(input: $input) {
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
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = {
        input: {
            lineItems: [
                {
                    variantId: globalVariantId, // Use the Base64-encoded variant ID here
                    quantity: quantity
                }
            ]
        }
    };

    try {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken,
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Shopify Storefront API Error: ${errorText}`);
            throw new Error('Failed to add product to checkout');
        }

        const data = await response.json();

        if (data.errors || data.data.checkoutCreate.userErrors.length) {
            const errors = data.errors || data.data.checkoutCreate.userErrors;
            console.error('User Errors:', errors);
            throw new Error(errors[0].message);
        }

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