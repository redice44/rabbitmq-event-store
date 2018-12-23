const buildEvent = message => {
  const {
    exchange,
    routingKey: routing_key
  } = message.fields;
  const {
    contentType: content_type,
    contentEncoding: content_encoding,
    timestamp
  } = message.properties;
  const simple_message = message.content.toString();

  return {
    exchange,
    routing_key,
    timestamp,
    content_type,
    content_encoding,
    simple_message
  };
};

module.exports = buildEvent;
