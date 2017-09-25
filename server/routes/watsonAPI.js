var watson = require('watson-developer-cloud');

var classify = function(userInput, callback) {
  var config = require('../package').config;
  var natural_language_classifier =
    watson.natural_language_classifier({
      username: config.NLC.username,
      password: config.NLC.password,
      version: "v1"
    })
  natural_language_classifier.classify({
    text: userInput,
    classifier_id: config.NLC.classifier_id
  }, function(err, response) {
    if (err) {
      console.log(err)
    } else {
      console.log(JSON.stringify(response, null, 2))
      callback(response)
    }
  })
};

module.exports.classify = classify;
