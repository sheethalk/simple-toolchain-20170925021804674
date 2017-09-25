var mongoose = require('mongoose');

module.exports = mongoose.model('Conversation', {
  messages: [{
    timestamp: Date,
    client: String,
    message:  String
  }],
  profile: [{}],
  conversationId: String,
  status: String
});
