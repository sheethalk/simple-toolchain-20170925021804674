var async = require('async');
var path = require('path');
var watson = require('watson-developer-cloud');
var fs = require('file-system');
var os = require("os");

module.exports = function(router) {
    // var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    // var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    //   url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
    //   username: "e720aa79-94f8-4989-978e-78739782619e",
    //   password: "q5vHs64aduKs",
    //   version_date: '2017-02 - 27'
    // });


    var tone_analyzer = watson.tone_analyzer({
        url: "https://gateway.watsonplatform.net/tone-analyzer/api",
        username: '7f1286f8-c433-4c49-8c49-c29c64cc9a85',
        password: 'uZk4o77lpDti',
        version: 'v3',
        version_date: '2016-05-19'
    });

    //
    //   router.post('/analyze', function(req, res) {
    //     var  CMessage = req.body.text;
    //     console.log("CM", CMessage)
    //
    //     // change any array to be a string
    //     //check the length of the string
    //
    //       var parameters = {
    //     'text':'', //place string variable here
    //       'features': {
    //       'entities': {
    //         'emotion': true,
    //         'sentiment': true,
    //         'limit': 2
    //       },
    //       'keywords': {
    //         'emotion': true,
    //         'sentiment': true,
    //         'limit': 2
    //       }
    //     }
    //   }
    //
    //     console.log(parameters);
    //     natural_language_understanding.analyze(parameters, function(err, response) {
    //       if (err)
    //         console.log('error:', err);
    //       else
    //         console.log(JSON.stringify(response, null, 2));
    //     });
    // });

    router.post('/tone', function(req, res) {
        var CMessage = req.body.text;
        tone_analyzer.tone({
                text: CMessage
            },
            function(err, tone) {
                if (err)
                    console.log(err);
                else
                    var results = JSON.stringify(tone, null, 2);
                console.log("tone post is working" + results);
                res.send(results)
            });
    });

};
