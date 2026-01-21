const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000';
const NUM_ORDERS = 50;

async function simulateOrders() {
    console.log(`Starting load test with ${NUM_ORDERS} orders...`);

    const start = Date.now();
    const promises = [];

    for (let i = 0; i < NUM_ORDERS; i++) {
        promises.push(
            axios.post(`${BACKEND_URL}/orders`, {
                table_number: `${Math.floor(Math.random() * 20) + 1}`,
                branch_id: "branch-1",
                items: [
                    { menu_item_id: "item-1", quantity: 2 },
                    { menu_item_id: "item-2", quantity: 1 }
                ]
            }).catch(e => ({ error: true }))
        );
    }

    const results = await Promise.all(promises);
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;

    const duration = Date.now() - start;
    console.log(`\n--- Load Test Results ---`);
    console.log(`Total Orders: ${NUM_ORDERS}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total Duration: ${duration}ms`);
    console.log(`Avg per order: ${(duration / NUM_ORDERS).toFixed(2)}ms`);
}

simulateOrders();
