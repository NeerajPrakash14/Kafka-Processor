const { kafka } = require('./main')
// const { publisher, subscriber } = require('./pub-sub_cp')
const structured_msg_schema = require('../structured_msg_schema.json');

const CLEANUP_INTERVAL = 1 * 1000; // in milliseconds

let messages = [];
let summary = { "msg_count": 0 };

const producer = kafka.producer()


async function send_msg(topic, messages) {
    console.log("produced to test-topic-u");

    await producer.send({
        topic: topic,
        messages: messages,
    })
}

async function produce_msg(msg) {
    await producer.connect()
    await send_msg("test-topic-u", [
        msg
    ])
    //await producer.disconnect() 
}

function processMessage(message, msg_schema = structured_msg_schema) {
    let s_msg = msg_schema;
    console.log("consumed by cgroup1");
    produce_msg(s_msg);
}





async function consume_msg(consumer, topicName) {
    await consumer.connect();
    await consumer.subscribe({ topic: topicName, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
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

startConsumers(5, 'cgroup1', 'test-topic');



