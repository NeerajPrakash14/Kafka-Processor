
const {kafka} = require('./main')

const producer = kafka.producer()
//module.exports = produce_msg()
produce_msg()


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
    }, 1000)
    // await send_msg("topic1", [
    //     { value: 'Hello KafkaJS userrrr!' },
    // ])

    //await producer.disconnect() 
}


