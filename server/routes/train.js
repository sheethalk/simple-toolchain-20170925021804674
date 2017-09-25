var async = require('async');
var path = require('path');
var watson = require('watson-developer-cloud');
var fs = require('file-system');
var os = require("os");
var csvWriter = require('csv-write-stream');

module.exports = function(router) {
    //get training file
    var file = './training/training.csv';

    //get date (used to name training file)
    var date = new Date();

    //set classifier
    var natural_language_classifier = watson.natural_language_classifier({
        url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
        username: '69fb6d24-986c-412a-9057-4e42238218e2',
        password: '1wJElymZJ8sk',
        version: 'v1'
    });

    //set params
    var params = {
        language: 'en',
        name: date,
        training_data: fs.createReadStream(file)
    };


    router.post('/train', function(req, res) {
      console.log("training data update")
        var Tphrase = req.body.row.phrase;
        var Tclass = req.body.row.class;
        var writer = csvWriter({
            sendHeaders: false
        })

        writer.pipe(fs.createWriteStream(file, {
            flags: 'a'
        }))
        writer.write({
            Tphrase,
            Tclass
        })
        writer.end();
        console.log("success");
    });


    //turn into function to create classifier
    router.post('/createclass', function(req, res) {
      console.log(params);
      console.log("creating classifier");
        natural_language_classifier.create(params, function(err, response) {
          console.log("WE ARE HERE");
            if (err) {
                console.log(err);
            }
            else{
            console.log(JSON.stringify(response.classifier_id, null, 2));
            var newClass = JSON.stringify(response.classifier_id, null, 2);
            res.send(newClass);
          }
        });
    });

};

//USE RESPONSE TO SET NEW CLASSIFIER
