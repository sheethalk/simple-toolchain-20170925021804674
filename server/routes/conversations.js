var Conversations = require('../models/conversations');

module.exports = function(router) {
    router.post('/conversation/save', function(req, res) {

      // console.log(req.body.conversation.messages);

      var messageObj = req.body.conversation.messages;

      var jsonString = JSON.stringify(messageObj);
      // messageObj = JSON.parse(JSON.stringify(messageObj).replace("messages", "message"));
      jsonString = jsonString.replace(/messages/g, "message");

      messageObj = JSON.parse(jsonString)
        for(var message in messageObj){
          // console.log(messageObj[message]);
          messageObj[message].client = messageObj[message].from == "customer" ? true : false;
          messageObj[message].timestamp = new Date().toISOString()
        }

        for(var message in messageObj){
          console.log(messageObj[message]);
        }

        var conversation = {
            messages: messageObj,
            profile: req.body.profile,
            clientId: req.body.id.clientId,
            conversationId: req.body.id.conversationId,
            dialogId: req.body.id.dialogId,
            status: ''
        }

        if(conversation.profile.topic == 'Help'){
          conversation.profile.topic = conversation.profile.helpTopic;
        }

        if (conversation.profile.started === 'yes') {
            if (conversation.profile.Product === "Yes" && conversation.profile.Completed === "Yes") {
                conversation.status = 'Completed: Product Selected'; // product selected
            } else if (conversation.profile.Product === "Yes" && conversation.profile.Completed === "No") {
                conversation.status = 'Completed: Product Recommended'; // product recommended
            }
            else if (conversation.profile.LiveChat === "Yes") {
                conversation.status = 'Delegated'; // not needed
            }
            else {
                conversation.status = 'Abandoned' //stays
            }

            //update a existing conversation - or save a new one
            Conversations.findOne({
                conversationId: req.body.id.conversationId
            }, function(err, docs) {
                if (docs) {
                    var query = {
                        conversationId: req.body.id.conversationId
                    }
                    Conversations.update(query, {
                        messages: conversation.messages,
                        profile: conversation.profile,
                        status: conversation.status
                    }, function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("DB Update");
                        }
                    })
                } else {
                    var myconversation = new Conversations(conversation);
                    myconversation.save(function(err) {
                        if (err) console.log(err)
                        else console.log('Conversation saved');
                    })
                }
            });


        }
        res.end();
    });

};
