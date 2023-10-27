const {kafka} = require('./main');



(async () => {
    const admin = kafka.admin()
    await admin.connect()


    let total_lag = 0;
    const offset_info = {};

    // returns most recent offset for a topic.
    async function fetchTopicOffsets(){
        const res = await admin.fetchTopicOffsets("app1")
       //console.log("Topic offset - ", res);
        for(const record of res){
            offset_info[record['partition']] = record['offset']
        }
    }
    
    
    // returns the consumer group offset for a list of topics.
    async function fetchOffsets(){
        const res = await admin.fetchOffsets({ groupId: "cgroup1", topics: ['app1'] })
        const partitions = res[0]['partitions'];
        //console.log(partitions[0]);
        for(const partition of partitions){
            total_lag = total_lag + (offset_info[partition['partition']] - partition['offset']);
        }

    }
    
    
    await fetchTopicOffsets()
    await fetchOffsets()
    console.log('Total lag : ',total_lag );


    await admin.disconnect()
})();

