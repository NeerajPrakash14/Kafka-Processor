
const {kafka} = require('../src/main')

const MESSAGE_INTERVAL = 1; // in milliseconds
let TOTAL_MESSAGES = 1000000

const producer = kafka.producer()
let calls = 0;




async function send_msg(topic, messages){
    console.log('Sending message - ', TOTAL_MESSAGES);
    await producer.send({
        topic: topic ,
        messages: messages, 
        })
}

async function produce_msg(){
    await producer.connect()

    while(TOTAL_MESSAGES > 0){
        TOTAL_MESSAGES = TOTAL_MESSAGES - 1;
        await send_msg("time-test-topic", [
            { value: "value1"},
        ])
    }
       

    //await producer.disconnect() 
}

function startProducers(producerCount){
    for(let i=0;i<producerCount;i++){
        produce_msg(i)
    }
}

startProducers(5);
