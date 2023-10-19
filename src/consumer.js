const {kafka} = require('./main')
//const {publisher, subscriber} = require('./pub-sub')


const consume_msg = async (consumer) => {
    await consumer.connect();
    await consumer.subscribe({ topic: "app1", fromBeginning: true });
  
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


    //console.time("single_consumer");
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
    //console.timeEnd("single_consumer");
};


// function startConsumers(consumerCount){
//     for(let i=0;i<consumerCount;i++){
//         const consumer1 = kafka.consumer({ groupId: 'group1' })
//         consume_msg(consumer1).catch(console.error);
//     }
// }

// startConsumers(1);



const consumer2 = kafka.consumer({ groupId: 'cgroup2' })
consume_msg(consumer2).catch(console.error);
