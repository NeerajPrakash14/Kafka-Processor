const { kafka } = require('./main')
// const { publisher, subscriber } = require('./pub-sub_cp')
const structured_msg_schema = require('../structured_msg_schema.json');

const CLEANUP_INTERVAL = 1 * 1000; // in milliseconds

let messages = [];
let summary = { "msg_count": 0 };


function processMessage(message, msg_schema = structured_msg_schema) {
    let s_msg = msg_schema;
    console.log('Message - ', message);
}





async function consume_msg(consumer, topicName) {
    await consumer.connect();
    await consumer.subscribe({ topic: topicName, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            // Process each consumed message
            // console.log({
            //   topic,
            //   partition,
            //   offset: message.offset,
            //   value: message.value.toString(),
            // });

            processMessage(message);

        },
    });
};


function startConsumers(consumerCount, groupId, topicName) {
    for (let i = 0; i < consumerCount; i++) {
        const consumer = kafka.consumer({ groupId: groupId })
        consume_msg(consumer, topicName).catch(console.error);
    }
}

startConsumers(5, 'cgroup2', 'test-topic-u');



