module.exports = {
  name: 'town_msg',
  schema: [{
    key: 'town',
    values: ['fairport', 'pittsford', 'victor'],
    description: 'Town names'
  }, {
    key: 'priority',
    values: ['critical', 'high', 'medium', 'low'],
    description: 'Priority of the message'
  }, {
    key: 'organization',
    values: ['SN', 'police', 'government', 'RIT'],
    description: 'Originating organization'
  }, {
    key: 'benefactor',
    values: ['SN', 'me', 'students', 'victims'],
    description: 'The benefactor of the message'
  }]
};
