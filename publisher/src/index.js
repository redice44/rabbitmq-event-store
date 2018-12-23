const moment = require('moment');
const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const topics = require('./topics');
const isRandomTopic = !!process.env.RANDOM_TOPIC;

const messageQuantity = isNaN(parseInt(process.env.SIZE)) ? 10 : parseInt(process.env.SIZE);
const connectionString = {
  user: process.env.RABBITMQ_USER,
  pass: process.env.RABBITMQ_PASS,
  url: process.env.RABBITMQ_URL
};
const { name, schema } = topics[process.env.PUB_TOPIC];
const subTopics = {
  town: 'victor',
  benefactor: 'SN',
  priority: 'low'
};
const main = async () => {
  const connection = new TopicConnector(connectionString, name, schema);
  try {
    await connection.connectWithRetry();
    await connection.createTopic();
    for (let i = 0; i < messageQuantity; i++) {
      const msg = `Msg: ${i}`;
      await connection.publishToTopic(
        isRandomTopic ? randomTopic(schema) : subTopics,
        msg,
        { timestamp: +moment() }
      );
    }
    await connection.close();
  } catch (error) {
    throw error;
  }
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
