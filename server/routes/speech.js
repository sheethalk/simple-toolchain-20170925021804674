var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
var fs     = require('file-system');
var tts =  require('./msbot-tts');
var amazon_tts = require('./amazon-tts.js');
var config = require('../package').config;
var components = require('../components');


  // "textToSpeech" : polly / bing / watson
  // "speechToText" : watson / bing
  // "dialog" : luis / watson

module.exports = function(router) {

  // For local development, replace username and password or set env properties
  var speechToText = extend({
    version:  config.speechToText.version,
    url:      config.speechToText.url,
    username: config.speechToText.username,
    password: config.speechToText.password,
    customization_id: "ca84c450-c089-11e6-9657-e53f14d32a55"
  });

  // Text to Speech
  var text_to_speech = watson.text_to_speech({
    version:  config.textToSpeech.version,
    url:      config.textToSpeech.url,
    username: config.textToSpeech.username,
    password: config.textToSpeech.password
  });

  var sttAuthService = watson.authorization(speechToText);

  router.get('/watsonToken', function(req, res) {
    sttAuthService.getToken({url: speechToText.url}, function(err, token) {
      if (err) {
        res.status(500).send('Error retrieving token');
        return;
      }
      res.json(token);
    });
  });

  router.post('/getSTTComponent', function(req, res) {
    console.log("get stt component")
    components = require('../components');
    res.json(components.speechToText);
  });

  router.post('/synthesise', function(req, res) {
    components = require('../components');

    var textToSpeechService = components.textToSpeech;

    switch(textToSpeechService){
      case "polly":
        synthesiseAmazon(req, res);
        break;

      case "bing":
        synthesiseMS(req, res);
        break;

      case "watson":
        synthesiseWatson(req, res);
        break;
    }
  });

  function synthesiseWatson(req, res){
    var textContent = req.body.text;

    var textParams = {
      text: textContent,
      accept: "audio/wav",
      voice: "en-US_MichaelVoice"
    };

    var ran = Math.floor((Math.random() * 10000) + 1);
    var filePath = "intro" + ran + ".wav";

    text_to_speech.synthesize(textParams, function(err, response){
      if (err) console.log(err);
      else {
        fs.writeFile('../app/assets/text-to-speech/' + filePath, response, function(err) {
          if (err) console.log(err);
          else res.json(filePath);
        });
      }
    });
  }

  function synthesiseMS(req, res){
    var textContent = req.body.text;
    tts.textToSpeech(textContent, function(filePath){
      res.json(filePath);
    });
  }

  function synthesiseAmazon(req, res){
    var textContent = req.body.text;
    amazon_tts.textToSpeech(textContent, function(filePath){
      res.json(filePath);
    });
  }

};
