const {kafka} = require('./main')
const {publisher, subscriber} = require('./pub-sub_cp')

const CLEANUP_INTERVAL = 1 * 1000; // in milliseconds

let messages = [];
let summary = {"msg_count": 0};



const consume_msg = async (consumer) => {
    await consumer.connect();
    await consumer.subscribe({ topic: "app1", fromBeginning: true });
  
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


function startConsumers(consumerCount){
    for(let i=0;i<consumerCount;i++){
        const consumer = kafka.consumer({ groupId: 'cgroup1' })
        consume_msg(consumer).catch(console.error);
    }
}

startConsumers(10);

// consumer lag :
    // producers - 1000
    // Topic traffic - 1000 * 1000 = 1 M /s
    // consumer - 100
    // 1 con consumes nearly - 5000 /s
    // 100 con consumes nearly - 1 M /
    // lag - 2 
    // 
    // each service 

// const consumer1 = kafka.consumer({ groupId: 'cgroup1' })
// run(consumer1).catch(console.error);

function processMessage(message) {
    messages.push(message);
    summary[message['value']] = 1;
    summary['msg_count'] = summary['msg_count'] + 1;
}


// Interval Batch Publish to pub-sub channel
function cleanup(){
    messages = [];
    summary = {"msg_count": 0};
}

function publishSummary(){
    setInterval(async () => {

        publisher.publish('channel1', JSON.stringify(summary));
        cleanup();
       
    }, CLEANUP_INTERVAL)
}
publishSummary();


