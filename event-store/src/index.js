const TopicConnector = require('@redice44/rabbitmq-topic-routing-schema');
const buildEvent = require('./buildEvent');
const dbConnection = require('./dbConnection');
const topics = require('./topics');

const Models = dbConnection();
const connectionString = {
  user: process.env.RABBITMQ_USER,
  pass: process.env.RABBITMQ_PASS,
  url: process.env.RABBITMQ_URL
};
const { name, schema } = topics[process.env.SUB_TOPIC];
const processMessage = async message => {
  const payload = buildEvent(message);
  const event = await Models.Event.query()
    .insert({ ...payload })
    .returning('*');
  // console.log('Event:', event);
  // console.log('Message:', message);
  // console.log(`Timestamp: ${message.properties.timestamp}`);
  // console.log(`Exchange: ${message.fields.exchange}`);
  console.log(`Routing Key: ${message.fields.routingKey}`);
  console.log(message.content.toString());
};
const main = async () => {
  const connection = new TopicConnector(connectionString, name, schema);
  try {
    await connection.connectWithRetry();
    await connection.createTopic();
    await connection.subscribeToTopic({}, processMessage);
    console.log(`Monitoring: ${name}`);
  } catch (error) {
    throw error;
  }
};

main();
