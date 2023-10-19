
const {kafka} = require('./main')

const MESSAGE_INTERVAL = 1; // in milliseconds

const producer = kafka.producer()
let calls = 0;




async function send_msg(topic, messages){
    await producer.send({
        topic: topic ,
        messages: messages, 
        })
}

async function produce_msg(){
    await producer.connect()
    setInterval(async () => {
        calls = calls + 1;
        console.log("Calls -> ", calls);
        await send_msg("app1", [
            { value: "producerID"},
        ])
    }, MESSAGE_INTERVAL)
    //await producer.disconnect() 
}

function startProducers(producerCount){
    for(let i=0;i<producerCount;i++){
        produce_msg(i)
    }
}

startProducers(100);
