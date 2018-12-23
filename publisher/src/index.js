const moment = require('moment');
const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const topics = require('./topics');
const messageQuantity = isNaN(parseInt(process.env.SIZE)) ? 10 : parseInt(process.env.SIZE);

const main = async () => {
  const connectionString = {
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    url: process.env.RABBITMQ_URL
  };
  const { name, schema } = process.env.TOPIC && topics[process.env.TOPIC]
    ? topics[process.env.TOPIC]
    : topics[process.env.PUB_TOPIC];
  const connection = await setupConnection(connectionString, { name, schema });
  for (let i = 0; i < messageQuantity; i++) {
    const msg = {
      amount: 10,
      exchangeTarget: 'town_msg',
      start: +moment()
    };
    await connection.publishToTopic(
      randomTopic(schema),
      JSON.stringify(msg),
      { timestamp: +moment() }
    );
    console.log(`Exchange: ${name} | ${i}`);
  }
  await connection.close();
};

const setupConnection = async (connectionString, { name, schema }) => {
  const connection = new TopicConnector(connectionString, name, schema);
  await connection.connectWithRetry();
  await connection.createTopic();
  return connection;
};

const randomNum = n => Math.floor(Math.random() * n);

const randomTopic = schema => {
  const numTopics = randomNum(schema.length + 1);
  const topics = {};
  for (let i = 0; i < numTopics; i++) {
    const topic = schema[randomNum(schema.length)];
    topics[topic.key] = topic.values[randomNum(topic.values.length)];
  }
  return topics;
};

main();
