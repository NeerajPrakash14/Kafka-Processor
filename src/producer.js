
const {kafka} = require('./main')

const MESSAGE_INTERVAL = 1; // in milliseconds

const producer = kafka.producer()
//module.exports = produce_msg()




async function send_msg(topic, messages){
    await producer.send({
        topic: topic ,
        messages: messages, 
        })
}

async function produce_msg(){
    await producer.connect()
    setInterval(async () => {
        await send_msg("topic1", [
            { value: 'Hello KafkaJS user! ' + new Date().getTime().toString() },
        ])
    }, MESSAGE_INTERVAL)
    //await producer.disconnect() 
}

function startProducers(producerCount){
    for(let i=0;i<producerCount;i++){
        produce_msg()
    }
}

startProducers(1000);
