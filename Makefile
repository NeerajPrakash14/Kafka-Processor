kafka-up:
	docker rm -f zookeeper || echo "ZingZing zookeeper"
	docker rm -f broker || echo "ZingZing broker"
	docker rm -f schema-registry || echo "ZingZing schema-registry"
	docker rm -f redis || echo "ZingZing redis"
	docker compose up -d zookeeper
	docker compose up -d broker
	docker compose up -d schema-registry
	docker compose up -d redis
	docker compose exec -d broker kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 5 --topic test-topic
	docker-compose exec -d broker kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 5 --topic test-topic-u

kafka-down:
	docker rm -f zookeeper || true
	docker rm -f broker || true
	docker rm -f schema-registry || true
	docker rm -f redis || true
