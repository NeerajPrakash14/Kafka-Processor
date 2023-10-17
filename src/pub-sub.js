const { createClient } = require('redis');

// const client = createClient();
// client.on('error', err => console.log('Redis Client Error', err));


// async function run(){
//     await client.connect();

//     await client.set('key', 'value');
//     const value = await client.get('key');
// }
// run()


const publisher = createClient();
const subscriber = createClient();

(async () => {
    await publisher.connect();
    await subscriber.connect();
})();

function subscription_info(subscriber){
    // Subscribe to a channel
    subscriber.subscribe('channel1');

    // Event handler for incoming messages
    subscriber.on('message', (channel, message) => {
    console.log(`Received a message from channel '${channel}': ${message}`);
    });
    // Handle errors
    subscriber.on('error', (err) => {
        console.error(`Subscriber error: ${err}`);
    });
}

 // Subscribe to a channel
 subscriber.subscribe('channel1', (message) => {
    console.log(message);
 });

 // Event handler for incoming messages
 subscriber.on('message', (channel, message) => {
 console.log(`Received a message from channel '${channel}': ${message}`);
 });
 // Handle errors
 subscriber.on('error', (err) => {
     console.error(`Subscriber error: ${err}`);
 });

//subscription_info(subscriber);

// // Publish a message
// publisher.publish('channel1', 'Hello, subscribers!');


module.exports = {publisher, subscriber}


// When done, unsubscribe or quit the subscriber
// subscriber.unsubscribe('myChannel');
// subscriber.quit();

// Note: Ensure you close the connections properly when you're done.
// publisher.quit();
// subscriber.quit();
