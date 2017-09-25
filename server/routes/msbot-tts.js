var request = require('request');
var util = require('util');
var fs = require('fs');

//Variables needed for obtaining a JWT access token
var token;
var url_token= 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';
var headers_token = {
    'Ocp-Apim-Subscription-Key': 'd077009b1bb74ab5b8f20fdf7ff46adc',
    'Content-Length' : '0',
};

//Variables needed for text to speech request
var SsmlTemplate = "<speak version='1.0' xml:lang='en-us'><voice xml:lang='%s' xml:gender='%s' name='%s'>%s</voice></speak>";
var post_speak_data = util.format(SsmlTemplate, 'en-US', 'Male', 	"Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)", "Hello Laetitia, I'm Collette. Let's discuss your mortgage package.");
var headers_tts = {}
var url_tts = 'https://speech.platform.bing.com/synthesize';

//Function to obtain JWT access token
var textToSpeech = function(text, callback){
request.post({ url: url_token, headers: headers_token }, function (e, r, body) {
      //callback function
      if(r) token = r.body;

      headers_tts = {
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'X-Search-AppID': '07D3234E49CE426DAA29772419F436CA',
        'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960' ,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
      }

      post_speak_data = util.format(SsmlTemplate, 'en-US', 'Male', 	"Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)", text);

      request.post({
        url : url_tts,
        body: post_speak_data,
        encoding: null,
        headers: headers_tts,
      }, function(e, r, body){
        console.log("TTS Request");
        console.log("Status: " +r.statusCode);

        var ran = Math.floor((Math.random() * 10000) + 1);
        var filePath = "mstts" + ran + ".wav";
        fs.writeFile('../app/assets/text-to-speech/' + filePath, body, 'binary', function (err) {
          if(err) {
            console.log("Error occured creating tts audio file: "+err)
          } else {
            callback(filePath)
          }
      });
    });
  });
};

module.exports.textToSpeech = textToSpeech;
