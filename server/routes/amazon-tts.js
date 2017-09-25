var aws = require('aws-sdk');
require('../aws/auth.js');
var fs = require('fs');
polly = new aws.Polly();

var textToSpeech = function(text, callback){
  input = text;
  parameters = {
      "OutputFormat": "mp3",
      "Text": input,
      "TextType": "text",
      "VoiceId": "Russell"
  };

  synthCallback = function(err, data){
    if(err){
      console.log("Error calling api: " + err);
    }else{
      var ran = Math.floor((Math.random() * 10000) + 1);
      var filePath = "amazon_tts" + ran + ".mp3";
      fs.writeFile('../app/assets/text-to-speech/' + filePath, data.AudioStream, function(error){
        if(error){
          console.log("Error writing file: " + error);
        }else{
        console.log("Successfully saved speech");
        callback(filePath);
      }
      });
    }
  }
  polly.synthesizeSpeech(parameters, synthCallback);
}

module.exports.textToSpeech = textToSpeech;
