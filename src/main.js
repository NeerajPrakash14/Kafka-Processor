const { Kafka } = require('kafkajs')
// const {} = require('producer.js')
// const {} = require('consumer.js')


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
})


// Admin operation - Create topic, list topics, delete topics
async function Admin(){
  const admin = kafka.admin()

  await admin.connect()
  
  
  async function listTopics(){
    const count = await admin.listTopics()
    console.log("Topics: ", count);
  }
  
  async function createTopic(topicName, partitions, replicationFactor){
    const ack = await admin.createTopics({
      validateOnly: false,
      waitForLeaders: true,
      timeout: 10 * 1000,
      topics: [
        {
          topic: topicName,
          numPartitions: partitions ?? -1,     // default: -1 (uses broker `num.partitions` configuration)
          replicationFactor: replicationFactor ?? -1, // default: -1 (uses broker `default.replication.factor` configuration)
        }
      ]
    })
    console.log("Topic creation result - ", count);
  }
  
  listTopics();
  createTopic("app1", 1000, -1);
  
  await admin.disconnect()
}


Admin()





module.exports = {kafka}






