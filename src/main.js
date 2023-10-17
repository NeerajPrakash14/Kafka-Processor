const { Kafka } = require('kafkajs')
// const {} = require('producer.js')
// const {} = require('consumer.js')


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  })
  
module.exports = {kafka}






