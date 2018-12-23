const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const topics = require('./topics');

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
    await connection.publishToTopic(subTopics, 'hello');
    await connection.close();
  } catch (error) {
    throw error;
  }
};

main();
