var cms = require("../cms/qaCms.json");
var responses = cms;

var resObject = {
  context: {},
  output: {
    text: []
  }
};
var context = {}

var delegation = function(intent, entities) {
  if (context.LiveChat != "Yes") {
    context.LiveChat = "Yes";
    context.thisQuestion = "delegate";
    resObject.output.text[0] = "We're connecting you now, please wait for an expert to respond.";
  }
  resObject.context = context;
}

var orderDelay = function(intent, entities) {
  switch (context.thisQuestion) {
    case 'orderDelay':
      if (intent == 'orderDelay') {
        if (context.loggedIn) {
          context.thisQuestion = 'selectOrder'
          context.orderCarousel = true;
          resObject.output.text[0] = 'Apologies for the delay in your order. Let me go get your recent orders. <br> <b>Please click the order that has been delayed.</b>'
        } else {
          context.thisQuestion = 'loginUsername'
          resObject.output.text[0] = "You don't appear to be logged in. <br/><b>Please enter your username to proceed.</b>"
        }
      }
      break;

    case 'loginUsername':
      context.thisQuestion = 'loginPassword'
      resObject.output.text[0] = "Thank you. <br/><b>Now, please enter your password.</b>"
      break;

    case 'loginPassword':
      context.loggedIn = true;
      context.thisQuestion = 'selectOrderAfterLogin'
      context.orderCarousel = true;
      resObject.output.text[0] = 'Apologies for the delay in your order. Let me go get your recent orders. <br> <b>Please click the order that has been delayed.</b>'
      break;

    case 'selectOrder':
    case 'selectOrderAfterLogin':
      context.thisQuestion = 'confirmDelivery'
      resObject.output.text[0] = 'The reason it\'s delayed is that the item is out of stock at the moment. It\'ll be back in stock next Monday.<br> To compensate for this delay, you\'ll get complimentary next day delivery once it\'s back in stock. <br><b> Is this delivery okay?</b>'
      break;
    case 'confirmDelivery':
      if (intent == 'Yes') {
        context.thisQuestion = 'confirmOptions'
        resObject.output.text[0] = 'Okay, just to confirm. <br>Delivery Address: 5 Lexington Street Williamstown, NJ 08094 <br>Delivery Time: Between 5pm and 8pm<br> <a>Update delivery information</a><br><b>Is this information correct?</b>'
      } else if (intent == 'No') {
        context.thisQuestion = 'deliveryDetails'
        resObject.output.text[0] = '<b>When would you like to change the delivery to?</b>'
      }
      break;
    case 'deliveryDetails':
      context.thisQuestion = 'confirmOptions'
      resObject.output.text[0] = 'Okay, just to confirm <br>Delivery Address: 5 Lexington Street Williamstown, NJ 08094 <br>Delivery Time: Between 5pm and 8pm<br> <a>Update delivery information</a><br><b>Is this information correct?</b>'
      break;
    case 'confirmOptions':
      context.topic = 'question'
      resObject.output.text[0] = 'Cool, I\'ve changed your delivery for you.<br><b>Is there anything else I can help you with?</b>'
      break;
    default:

  }
  resObject.context = context;
}

var orderStatus = function(intent, entities) {
  console.log("This q is: " + context.thisQuestion);
  switch (context.thisQuestion) {
    case 'orderStatus':
      if (intent = 'orderStatus') {
        if (context.loggedIn) {
          context.thisQuestion = 'selectOrder'
          context.orderCarousel = true;
          resObject.output.text[0] = 'Here are you current orders. <br>  Please click the order you want to know the status of.'
        } else {
          context.thisQuestion = 'loginUsername'
          resObject.output.text[0] = "You don't appear to be logged in. <br/><b>Please enter your username to proceed.</b>"
        }
      }
      break;
    case 'loginUsername':
      console.log("get password")
      context.thisQuestion = 'loginPassword'
      resObject.output.text[0] = "Thank you. <br/><b>Now, please enter your password.</b>"
      break;

    case 'loginPassword':
      context.loggedIn = true;
      context.thisQuestion = 'selectOrderAfterLogin'
      context.orderCarousel = true;
      resObject.output.text[0] = 'Here are you current orders. <br>  Please click the order you want to know the status of.'
      break;

    case 'selectOrder':
    case 'selectOrderAfterLogin':
      context.topic = 'question'
      context.thisQuestion = ""
      resObject.output.text[0] = 'The status of that order is <span style=\"color:#ff9d00\">\'In Transit\'</span>. This means it is on its way to you right now.<br> It will arrive at your requested time slot between 5pm and 8pm. <br><b> Is there anything else I can help you with?</b>'
      break;
  }
  console.log("set context")
  resObject.context = context;
}

var questionAnswerLogic = function(intent, entities) {
  console.log('INTENT------' + intent);
  if (intent == 'joinMyBB') {
    resObject.output.text[0] = responses.intents[0].responses[Math.floor(Math.random() * responses.intents[0].responses.length)]
  };
  if (intent == 'myBBCost') {
    console.log(resObject.output.text[0] + 'BEFORE')
    resObject.output.text[0] = responses.intents[1].responses[Math.floor(Math.random() * responses.intents[1].responses.length)]
    console.log(resObject.output.text[0] + 'AFTER')
  };
  if (intent == 'missReward') {
    resObject.output.text[0] = responses.intents[2].responses[Math.floor(Math.random() * responses.intents[2].responses.length)]
  };
  if (intent == 'printReward') {
    resObject.output.text[0] = responses.intents[3].responses[Math.floor(Math.random() * responses.intents[3].responses.length)]
  };
  if (intent == 'wherePoints') {
    var appendString = ''
    if (context.loggedIn) {
      appendString = '<br>You currently have <b style=\'color:green\'>500 points</b> on your account.'
    }
    resObject.output.text[0] = responses.intents[4].responses[Math.floor(Math.random() * responses.intents[4].responses.length)] + appendString;
  };
};

var dialog = function(intent, entities, globalContext) {
  context = globalContext;
  console.log('TOPIC ------' + context.topic)
  if (intent == "delegate") {
    context.thisQuestion = "delegation";
    context.topic = "Delegation"
  }
  switch (context.topic) {
    case 'intro':
      if (context.started === 'no') {
        context.started = 'yes'
        context.topic = 'question'
        resObject.context = context
        resObject.output.text[0] = "Thank you for contacting Best Buy, I’m Anton, your Digital Assistant. <br> I can help you by answering questions, resolving account problems, managing orders and lots of other things.  I can also request additional assistance from a live agent if needed.<br/><b>  How may I assist you today?</b>"
      };
      break;
    case 'question':
      if (intent == 'orderStatus') {
        context.thisQuestion = "orderStatus"
        context.topic = 'orderStatus'
        orderStatus(intent, entities);
      } else if (intent == 'orderDelay') {
        context.thisQuestion = "orderDelay"
        context.topic = 'orderDelay'
        orderDelay(intent, entities);
      } else if (['joinMyBB', 'myBBCost', 'missReward', 'printReward', 'wherePoints'].indexOf(intent) > -1) {
        questionAnswerLogic(intent, entities);
      } else if (intent == 'No') {
        resObject.output.text[0] = 'Alright, I\'m happy to have helped. If you have any queries feel free to come back and chat again!<br> Have a great day!'
      }
      break;
    case 'orderDelay':
      orderDelay(intent, entities);
      break;
    case 'orderStatus':
      console.log("Order Status");
      orderStatus(intent, entities);
      break;
    case "Delegation":
      delegation(intent, entities);
      break;
    default:

  }


  return resObject;
}

module.exports.dialog = dialog;
