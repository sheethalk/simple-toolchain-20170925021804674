var async = require('async');
var path = require('path');
var watson = require('watson-developer-cloud');
var fs = require('file-system');
var os = require("os");
var config = require('../package').config;

module.exports = function(router) {

  var natural_language_classifier =
    watson.natural_language_classifier({
      username: config.NLC.username,
      password: config.NLC.password,
      version: "v1"
    })
  var Athreshold = 0.40;
  var Uthreshold = 1;

  //declare arrays for classiy results to be pushed into.
  var unmatched = [];
  var confident = [];



  router.post('/classify', function(req, res) {
    var phrases = req.body.phrases;
    var classifiedPhrases;





    //change the classifer id
    async.each(phrases, function(phrase, callback) {
        natural_language_classifier.classify({
            text: phrase,
            classifier_id: config.NLC.classifier_id

          },
          function(err, response) {
            if (err) console.log('error:', err);
            else {
              response.classes.forEach(function(phraseClass) {
                if (phraseClass.class_name === response.top_class && phraseClass.confidence < Uthreshold && phraseClass.confidence > Athreshold) {
                  console.log("Extracting >40")
                  console.log("resp " + JSON.stringify(response, null, 2))

                  confident.push({
                    phrase: response.text,
                    class: response.top_class,
                    confidence: phraseClass.confidence
                  });

                } else if (phraseClass.class_name === response.top_class && phraseClass.confidence < Athreshold) {

                  var phrase = response.text + ', ' + response.top_class + ', ' + phraseClass.confidence + os.EOL;

                  unmatched.push({
                    phrase: response.text,
                    class: response.top_class,
                    confidence: phraseClass.confidence
                  });
                }
              });
              callback();
            }
          }
        );
      }, function(err) {

        // if any of the file processing produced an error, err would equal that error
        if (err) console.log('A file failed to process');
        else {
          res.end();
        }
      }

    );


  });




  router.get('/classifyResults', function(req, res) {
    console.log('conf is ' + JSON.stringify(unmatched, null, 2));
    var jsonResp = {
      "confident": confident,
      "unmatched": unmatched
    };
    confident = []
    unmatched = [];

    res.send(jsonResp);

  });

};
