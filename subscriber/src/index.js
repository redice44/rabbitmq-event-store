const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const topics = require('./topics');

const connectionString = {
  user: process.env.RABBITMQ_USER,
  pass: process.env.RABBITMQ_PASS,
  url: process.env.RABBITMQ_URL
};
const { name, schema } = topics[process.env.SUB_TOPIC];
const subTopics = {
  town: 'victor',
  benefactor: 'SN'
};
const processMessage = message => {
  console.log('Message:', message);
};
const main = async () => {
  const connection = new TopicConnector(connectionString, name, schema);
  try {
    await connection.connectWithRetry();
    await connection.createTopic();
    await connection.subscribeToTopic(subTopics, processMessage);
    console.log('Listening');
  } catch (error) {
    throw error;
  }
};

main();
