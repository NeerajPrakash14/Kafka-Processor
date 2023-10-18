const {kafka} = require('./main')
//const {publisher, subscriber} = require('./pub-sub')


const run = async (consumer) => {
    await consumer.connect();
    await consumer.subscribe({ topic: "topic1", fromBeginning: true });
  
    // await consumer.run({
    //   eachMessage: async ({ topic, partition, message }) => {
    //     // Process each consumed message
    //     console.log({
    //       topic,
    //       partition,
    //       off set: message.offset,
    //       value: message.value.toString(),
    //     });

    //     // // Publish a message
    //     // await publisher.publish('channel1', 'Hello, subscribers!');

    //   },
    // });


    console.time("single_consumer");
    await consumer.run({
        eachBatchAutoResolve: false,
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
            //console.log('Batch -> ', batch);
            for (let message of batch.messages) {
                if (!isRunning() || isStale()) break
                console.log({
                    offset: message.offset,
                    value: message.value.toString(),
                  });
                resolveOffset(message.offset)
                await heartbeat()
            }
        },
        //maxBatchSize: 10
    })
    console.timeEnd("single_consumer");
};


const consumer1 = kafka.consumer({ groupId: 'cgroup1' })
run(consumer1).catch(console.error);

// const consumer2 = kafka.consumer({ groupId: 'cgroup2' })
// run(consumer2).catch(console.error);
