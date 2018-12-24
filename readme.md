# Event Store Test Lab

## Commands

### Run RabbitMQ

Command: `./go start rabbitmq`

### Run Event Store

Command: `./go start event-store`

Subscribes to:
- All topics in `SUB_TOPIC` defined in the `docker-compose.yml`
  - Writes all messages going into `SUB_TOPIC` to postgres. 
- Replay queue for `time = last`
  - Queries for `amount` events after `start` timestamp from `exchangeTarget`.
  - Replays them in the defined `replayExchange`.
    - If `replayExchange` and `exchangeTarget` are the same there will be duplicate events in the db.
- Replay queue for `time = between`
  - Not implemented yet :(
  - Will get events between start and end timestamps

### Run Subscriber

Command: `./go start sub`

Subscribes to:
- All topics in `SUB_TOPIC` defined in the `docker-compose.yml`
- All topics in replay_`SUB_TOPIC`. The designated replay queue for `SUB_TOPIC` 

### Publish random things

Command: `./go pub [topic] [n]`

Will publish to random permutation of sub-topics and values.

- `topic` must be a valid topic schema defined in all containers :(
- `n` is the number of messages sent.

### Replay events

Command: `./go pub replay [topic] [n] [timestamp]`

- `topic` must be a valid topic schema defined in all containers :(
- `n` is the number of messages to replay.
- `timestamp` is the start timestamp. Defaults to now.
