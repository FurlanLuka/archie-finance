1. docker-compose up
2. Install aws cli if you dont have it
3. aws dynamodb create-table --cli-input-json file://dynamodb-table-event-log.json --endpoint-url http://localhost:8000
4. aws dynamodb create-table --cli-input-json file://dynamodb-table-idempotency.json --endpoint-url http://localhost:8000
5. aws dynamodb list-tables --endpoint-url http://localhost:8000 - validate that tables have been created