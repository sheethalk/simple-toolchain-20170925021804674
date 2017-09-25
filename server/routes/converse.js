var path = require('path')
var watson = require('watson-developer-cloud')
var config = require('../package').config
var luisAPI = require('./luisAPI')
var watsonAPI = require('./watsonAPI')
var problemSolveLogic = require('../dialogs/problemSolveLogic')
var tvAdviceLogic = require('../dialogs/tvAdviceLogic')
var Conversations = require('../models/conversations')
var fs = require('fs')
var components = require('../components')
var numConversion = require('./wordToNum')

var mongoose = require('mongoose');

module.exports = function(router) {

  //Conversation uses "context" instead of getProfileVars
  var context = {};
  var dialogId = '';
  var dialogName = '';

  //The current progress the user has made. Increment every time the user has made changes (including Rationale)
  var currentStep = 0;

  // Get all dialogs
  router.post('/conversation', function(req, res, next) {
    /*
    CONVERSATION INITIALIZER
    WATSON - call watsonAPI.converse with blank input and context
    MSBot - Call logic unit with blank
    */
    //restart

    var originPage = req.body.originPage;

    switch (components.dialog) {

      case "watson":

        context = {
          "conversing": false,
          "started": "no",
          "2": "No",
          "4": "No",
          "5": "No",
          "conversation_id": "",
          "1A": "No",
          "1B": "No",
          "2R": "No",
          "3A": "No",
          "3B": "No",
          "4R": "No",
          "5R": "No",
          "1AR": "No",
          "1BR": "No",
          "3AR": "No",
          "3BR": "No",
          "product": "n",
          "completed": "no",
          "nextQuestion": "",
          "thisQuestion": "",
          "explainAttempt": 0,
          "questionAttempt": 0,
          "topic": "intro",
          "fullTerm": 16,
          "whyAttempt": 0,
          "fullTermRat": "",
          "RateType": "",
          "rateTypeRat": "",
          "initTerm": "",
          "initTermRat": "",
          "payFee": "No",
          "PayFees": "No",
          "feeUpfront": "no",
          "FeesUpfront": "No",
          "Overpayments": "No",
          "Recommend": "No",
          "helpConfirm": false,
          "HelpTopic": "",
          "LiveChat": "No",
          "originPage": originPage,
          "closeWindow": false,
          "loggedIn": false
        }

        if (originPage == "home") {
          var resp = problemSolveLogic.dialog('', '', context);
          res.send(resp);
        } else {
          var resp = tvAdviceLogic.dialog('', '', context);
          res.send(resp);
        }
        break;

      case "luis":

         context = {
          "conversing": false,
          "started": "no",
          "2": "No",
          "4": "No",
          "5": "No",
          "conversation_id": "",
          "1A": "No",
          "1B": "No",
          "2R": "No",
          "3A": "No",
          "3B": "No",
          "4R": "No",
          "5R": "No",
          "1AR": "No",
          "1BR": "No",
          "3AR": "No",
          "3BR": "No",
          "product": "n",
          "completed": "no",
          "nextQuestion": "",
          "thisQuestion": "",
          "explainAttempt": 0,
          "questionAttempt": 0,
          "topic": "intro",
          "fullTerm": 16,
          "whyAttempt": 0,
          "fullTermRat": "",
          "RateType": "",
          "rateTypeRat": "",
          "initTerm": "",
          "initTermRat": "",
          "payFee": "No",
          "PayFees": "No",
          "feeUpfront": "no",
          "FeesUpfront": "No",
          "Overpayments": "No",
          "Recommend": "No",
          "helpConfirm": false,
          "HelpTopic": "",
          "LiveChat": "No",
          "originPage": originPage,
          "closeWindow": false,
          "loggedIn": false
        }

        context.conversation_id = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        checkId();

        function checkId() {
          Conversations.findOne({
            conversationId: context.conversation_id
          }, function(err, docs) {
            if (docs) {
              context.conversation_id = randomString(16, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
              checkId();
            } else {
              console.log("ID is unique")
            }
          });
        }

        function randomString(length, chars) {
          var result = '';
          for (var i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
          return result;
        };

        //initialising conversation :)
        //using convs service
        if (originPage == "home") {
          var resp = problemSolveLogic.dialog('', '', context);
          res.send(resp);
        } else {
          var resp = tvAdviceLogic.dialog('', '', context);
          res.send(resp);
        }
        break;
    }

  });

  router.post('/converse', function(req, res, next) {

    console.log("--------PAGE OF ORIGIN IS: " + req.body.originPage)

    //WATSON - use watsonAPI
    //LUIS - use luisAPI then logic
    context = req.body.context;

    switch (components.dialog) {

      case "watson":
        function watsonCallback(response) {
          console.log(response)
          if (context.originPage == "home") {
            var resp = problemSolveLogic.dialog(response.top_class, '', context)
            res.send(resp)
          } else {
            var resp = tvAdviceLogic.dialog(response.top_class, '', context)
            res.send(resp)
          }
        }

        var newInput = numConversion.wordsToNum(req.body.input);
        watsonAPI.classify(req.body.input, watsonCallback)
        break;

      case "luis":

        function luisCallback(response) {
          // var realRes = JSON.parse(response)
          console.log("response " + JSON.stringify(response, null, 2));
          if (context.originPage == "home") {
            var resp = problemSolveLogic.dialog(response.topScoringIntent.intent, response.entities, context);
            res.send(resp);
          } else {
            var resp = tvAdviceLogic.dialog(response.topScoringIntent.intent, response.entities, context);
            res.send(resp);
          }
        }

        var newInput = numConversion.wordsToNum(req.body.input);
        luisAPI.classify(newInput, luisCallback);

        break;
    }
  });

  router.post('/updateComponents', function(req, res) {

    comps = req.body;

    components.textToSpeech = comps.textToSpeech
    components.speechToText = comps.speechToText;
    components.dialog = comps.dialog;

    fs.writeFile("./components.json", JSON.stringify(components), function(err) {
      if (err) return console.log(err)
      console.log(JSON.stringify(components))
    })

    res.send(components);
  });


  router.get('/readComponents', function(req, res) {

    console.log("Reading components.")

    res.send({
      comp_tts: components.textToSpeech,
      comp_stt: components.speechToText,
      comp_dialog: components.dialog
    });
  });

  router.post('/alexa', function(req, res) {
    console.log("TEST");
    // req = JSON.parse(req);
    // console.log(JSON.stringify(req.body, null, 2))
    var intents = req.body.intents;
    var entities = req.body.entities;
    var resp = dialogLogic.dialog(intents, entities, '');
    console.log(resp);
    res.send(resp);
  })


  router.get('/dropDB', function(req, res) {
    console.log("in drop db endpoint");

    Conversations.remove({}, function(err) {
      if (err) console.log(err);
      console.log("db dropped")
    })


  })

}
