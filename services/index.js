const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'hourly-aggregator',
  brokers: ['kafka-broker:9092'], // Update with your Kafka broker(s)
});

const consumer = kafka.consumer({ groupId: 'hourly-consumer' });
const producer = kafka.producer();

const inputTopic = 'input-topic'; // Topic to consume messages from
const outputTopic = 'output-topic'; // Topic to write accumulated values to

// Function to accumulate values within an hour
let accumulatedValue = 0;
const accumulateHourlyValue = () => {
  // Write the accumulated value to the output topic
  producer.send({
    topic: outputTopic,
    messages: [{ value: accumulatedValue.toString() }],
  });

  // Reset the accumulator for the next hour
  accumulatedValue = 0;
};

(async () => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: inputTopic, fromBeginning: false });

  // Set a timer to accumulate values and reset every hour
  setInterval(accumulateHourlyValue, 3600000); // 1 hour = 3600000 milliseconds

  await consumer.run({
    eachMessage: async ({ message }) => {
      // Process the consumed message and accumulate values
      const value = parseInt(message.value, 10); // Assuming the message contains an integer value
      accumulatedValue += value;
      console.log(`Accumulated Value: ${accumulatedValue}`);
    },
  });
})();
