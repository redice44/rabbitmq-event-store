const moment = require('moment');
const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const topics = require('./topics');
const replayExchange = process.env.REPLAY_TOPIC || 'town_msg';
const replayAmount = process.env.REPLAY_AMOUNT || 10;

const main = async () => {
  const connectionString = {
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    url: process.env.RABBITMQ_URL
  };
  const { name, schema } = topics['replay'];
  const connection = await setupConnection(connectionString, { name, schema });
  const msg = {
    amount: replayAmount,
    exchangeTarget: replayExchange,
    start: +moment()
  };
  await connection.publishToTopic(
    { time: 'last' },
    JSON.stringify(msg),
    { timestamp: +moment() }
  );
  console.log(msg);
  await connection.close();
};

const setupConnection = async (connectionString, { name, schema }) => {
  const connection = new TopicConnector(connectionString, name, schema);
  await connection.connectWithRetry();
  await connection.createTopic();
  return connection;
};

main();
