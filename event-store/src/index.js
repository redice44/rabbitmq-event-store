const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const buildEvent = require('./buildEvent');
const dbConnection = require('./dbConnection');
const topics = require('./topics');
const Models = dbConnection();

const main = async () => {
  const connectionString = {
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    url: process.env.RABBITMQ_URL
  };
  const processRecordingMessage = async message => {
    const payload = buildEvent(message);
    const event = await Models.Event.query()
      .insert({ ...payload })
      .returning('*');
    // console.log('Event:', event);
    // console.log('Message:', message);
    // console.log(`Timestamp: ${message.properties.timestamp}`);
    // console.log(`Exchange: ${message.fields.exchange}`);
    console.log('Recording Message');
    console.log(`Routing Key: ${message.fields.routingKey}`);
    console.log(message.content.toString());
  };
  const processReplayLastMessage = async message => {
    console.log('Replay Last Message');
    console.log(`Routing Key: ${message.fields.routingKey}`);
    const content = JSON.parse(message.content.toString());
    console.log(content);
    const events = await Models.Event.query()
      .where('timestamp', '<', content.start)
      .orderBy('timestamp', 'desc')
      .limit(content.amount)
      .returning('*');
    console.log('events', events);
  };
   const processReplayBetweenMessage = async message => {
    console.log('Replay Between Message');
    console.log(`Routing Key: ${message.fields.routingKey}`);
    console.log(message.content.toString());
  };
  const replayLastConnection = await setupConnection(connectionString, topics['replay']);
  const replayBetweenConnection = await setupConnection(connectionString, topics['replay']);
  const recordingConnection = await setupConnection(connectionString, topics[process.env.SUB_TOPIC]);

  await replayLastConnection.subscribeToTopic({ time: 'last' }, processReplayLastMessage);
  await replayBetweenConnection.subscribeToTopic({ time: 'between' }, processReplayBetweenMessage);
  await recordingConnection.subscribeToTopic({}, processRecordingMessage);
};

const setupConnection = async (connectionString, { name, schema }) => {
  const connection = new TopicConnector(connectionString, name, schema);
  await connection.connectWithRetry();
  await connection.createTopic();
  return connection;
};

main();
