kafka-up:
	docker rm -f zookeeper || echo "ZingZing zookeeper"
	docker rm -f broker || echo "ZingZing broker"
	cd ./docker && docker compose up -d broker
	cd ./docker && docker compose up -d zookeeper
	cd ./docker && docker compose exec -d broker kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic test-topic1
	cd ./docker && docker-compose exec -d broker kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic test-topic2

kafka-down:
	docker rm -f zookeeper || true
	docker rm -f broker || true
