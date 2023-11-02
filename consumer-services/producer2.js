
const {kafka} = require('../src/main')
const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads');


const topic = 'time-test-topic';
const numProducers = 10;



if (isMainThread) {
  // This is the main thread.
  const count = 1000000;
  const sharedCount = new Int32Array(new SharedArrayBuffer(4));
  sharedCount[0] = count;

  const threads = [];
  for (let i = 0; i < numProducers; i++) {
    threads.push(
      new Worker(__filename, {
        workerData: { count, sharedCount },
      })
    );
  }

  threads.forEach((thread, index) => {
    thread.on('message', (message) => {
      if (message === 'done') {
        console.log(`Producer ${index} has finished.`);
      }
    });
  });

  const checkCount = () => {
    if (Atomics.load(sharedCount, 0) === 0) {
      console.log('All producers have finished.');
      threads.forEach((thread) => thread.postMessage('stop'));
    } else {
      setTimeout(checkCount, 1);
    }
  };

  checkCount();
} else {
  // This is a producer worker thread.

  const count = workerData.count;

    async function runKafkaProducer() {
      const producer = kafka.producer();
      await producer.connect();

      while (workerData.sharedCount > 0) {
          // Produce a message to the Kafka topic
          await producer.send({
          topic,
          messages: [{ value: 'Your message content here' }],
          });
          console.log(`Sending message ${workerData.sharedCount} from thread - ${threadId}`);
          // Decrement the count
          Atomics.sub(workerData.sharedCount, 0, 1);
      }

      await producer.disconnect();
    }

  runKafkaProducer()
    .then(() => {
      parentPort.postMessage('done');
    })
    .catch((error) => {
      console.error(`Producer thread error: ${error}`);
      parentPort.postMessage('done');
    });
}
