const { Kafka } = require('kafkajs');
const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads');

const { kafka } = require('../src/main')


// Topic to consume from
const topic = 'time-test-topic';
const groupId = 'time-test-group';
const numConsumers = 10;


// Function to create and run a Kafka consumer
const runKafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      // Process the message
      console.log(`Received message: ${message.value.toString()} from thread - ${threadId}`);
    },
  });
};

// Main thread: Create and run Kafka consumers in separate threads
if (isMainThread) {
  const startTime = Date.now();
  setInterval(() => {
    console.log( Date.now() - startTime);
  }, 1000)
  

  for (let i = 0; i < numConsumers; i++) {
    const worker = new Worker(__filename, {
      workerData: { consumerId: i , startTime},
    });

    worker.on('online', () => {
      console.log(`Consumer ${i} is running in a separate thread.`);
    });
  }
}

// Worker thread: Run the Kafka consumer
if (!isMainThread) {
  runKafkaConsumer().catch((error) => {
    console.error(`Consumer ${workerData.consumerId} error: ${error}`);
  });
}

