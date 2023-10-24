const {KafkaStreams} = require("kafka-streams");
const config = require("../streams-config.json");

const kafkaStreams = new KafkaStreams(config);
kafkaStreams.on("error", (error) => console.error(error));


const kafkaTopicName = "app1";
const stream = kafkaStreams.getKStream(kafkaTopicName);
stream.forEach(message => console.log(message));
stream.start().then(() => {
    console.log("stream started, as kafka consumer is ready.");
}, error => {
    console.log("streamed failed to start: " + error);
});
