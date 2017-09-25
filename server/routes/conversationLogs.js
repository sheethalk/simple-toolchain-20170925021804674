var moment          = require('moment');
var cronJob         = require('cron').CronJob;
var watson          = require('watson-developer-cloud');
var config          = require('../package').config;
var Conversations   = require('../models/conversations');
var fs              = require('file-system');

/**
 * A script to run automatically every midnight getting the previous 24 hours of conversation logs
 * Using a NPM Module: CRON
 * Have to firstly get the dialog id we want which is workinprogress and use this to get the
 * conversation logs.
 * Conversations are parsed and reformatted, stripping out all the unnecessary data
 */

module.exports = function(router) {
  new cronJob('00 * * * * *', function() {
    var cronDialogId;

    var dialog_service = watson.dialog({
      username: config.dialog.username,
      password: config.dialog.password,
      version:  config.dialog.version
    });

    dialog_service.getDialogs({}, function(err, dialogs) {
      if (err) return res.json(err)
      else {
        dialogs.dialogs.forEach(function(dialog) {
          if (dialog.name === "clean up") cronDialogId = dialog.dialog_id;
        });

        if (cronDialogId) {
          var dateTo   = moment().format("YYYY-MM-DD HH:mm:ss");
          var dateFrom = moment().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss");

          var params = {
            date_from: dateFrom,
            date_to:   dateTo,
            dialog_id: cronDialogId
          };


          var file = '../app/assets/phrases/code.txt';

          dialog_service.getConversation(params, function(err, conversationLogs) {
            if (err) console.log(err);
            else {

              fs.exists(file, function(exists) {
                if (exists) {
                  fs.unlink(file, function(err) {
                    if (err) throw err;
                  });
                }
              });

              var convo = JSON.stringify(conversationLogs);

              fs.appendFile(file, convo, function(err) {
                if (err) console.log(err);
                else console.log("done");
              });

              conversationLogs.conversation.forEach(function(conversation) {
                conversation.save(function (err) {
                     if (err) return err;
                     else console.log(elem["conversation_id"] + " saved");
                   });
              })

              var myObjArr = [];
              var i;


              // Number of conversations
              var conversationsLength = conversationLogs.conversations.length || 0;

              for (i = 0; i < conversationsLength; i++) {

                // Conversation details/meta data
                var conversationID = conversationLogs.conversations[i]['conversation_id'];
                var clientID = conversationLogs.conversations[i]['client_id'];
                var messagesArray = conversationLogs.conversations[i]['messages'];
                var startTimeString = conversationLogs.conversations[i]['messages'][0]['date_time'];
                var endTimeString = conversationLogs.conversations[i]['messages'].slice(-1) [0]['date_time'];
                var startDate = new Date(startTimeString);
                var endDate = new Date(endTimeString);
                var dateDifference = new Date(endDate - startDate);
                var conversationStartTime = startDate.toTimeString().split(' ')[0];
                var conversationEndTime = endDate.toTimeString().split(' ')[0];
                var conversationDuration = dateDifference.toTimeString().split(' ')[0];
                var userInteractionsCount = 0;
                conversationLogs.conversations[i]['messages'].forEach(function (elem) {
                  userInteractionsCount += elem['from_client'] === 'true' ? 1 : 0;
                });
                var conversationStatus;

                // Mortgage Details
                var customerName;
                var propertyValue;
                var propertyLocation;
                var minimumTermLength;
                var maximumTermLength;
                var depositAmount;
                var LTV;
                var lastSection;

                conversationLogs.conversations[i]['profile'].forEach(function (elem) {
                  if (elem['name'] === 'Name') customerName = elem['value'];
                  if (elem['name'] === 'Value') propertyValue = parseInt(elem['value']);
                  if (elem['name'] === 'Location') propertyLocation = elem['value'];
                  if (elem['name'] === 'MinTerm') minimumTermLength = parseInt(elem['value']);
                  if (elem['name'] === 'MaxTerm') maximumTermLength = parseInt(elem['value']);
                  if (elem['name'] === 'Deposit') depositAmount = parseInt(elem['value']);
                  if (elem['name'] === 'LTV') LTV = parseInt(elem['value']);
                  if (elem['name'] === 'LastSection') lastSection = parseInt(elem['value']);

                  // FIX: this part doesn't work as expected - every conversation status is abandoned
                  if (elem['name'] === 'Recommend') {
                    conversationStatus = 'completed';
                  }
                  else if (elem['name'] === 'LiveChat') {
                    conversationStatus = 'delegated';
                  } else {
                    conversationStatus = 'abandoned';
                  }
                });

                var myObj = {
                  'customer_name': customerName,
                  'conversation_id': conversationID,
                  'client_id': clientID,
                  'messages': messagesArray,
                  'start_date': startDate,
                  'end_date': endDate,
                  'user_interaction_count': userInteractionsCount,
                  'property_value': propertyValue,
                  'property_location': propertyLocation,
                  'minimum_term_length': minimumTermLength,
                  'maximum_term_length': maximumTermLength,
                  'deposit_amount': depositAmount,
                  'ltv': LTV,
                  'conversation_status': conversationStatus,
                  'lastSection': lastSection
                };

                myObjArr.push(myObj);
              }

               myObjArr.forEach(function (elem) {
                 myConvo = new Conversations(elem);

                 myConvo.save(function (err) {
                   if (err) return err;
                   else console.log(elem["conversation_id"] + " saved");
                 });
               });

            }
          });
        }
      }
    });

  }, null, true, 'Europe/London');
};
