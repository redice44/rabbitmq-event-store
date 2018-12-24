const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const topics = require('./topics');

const processMainMessage = message => {
  console.log('Main:', message.content.toString());
};
const processReplayMessage = message => {
  console.log('Replay: ', message.content.toString());
};
const main = async () => {
  const connectionString = {
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    url: process.env.RABBITMQ_URL
  };
  const { name, schema } = topics[process.env.SUB_TOPIC];
  const mainConnection = await setupConnection(connectionString, { name, schema });
  const replayConnection = await setupConnection(connectionString, { name: `replay_${name}`, schema });
  await mainConnection.subscribeToTopic({}, processMainMessage);
  await replayConnection.subscribeToTopic({}, processReplayMessage)
};
const setupConnection = async (connectionString, { name, schema }) => {
  const connection = new TopicConnector(connectionString, name, schema);
  await connection.connectWithRetry();
  await connection.createTopic();
  return connection;
};
main();
