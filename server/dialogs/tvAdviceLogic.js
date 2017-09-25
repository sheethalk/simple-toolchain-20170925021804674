var resObject = {
    context: {},
    output: {
        text: []
    }
};
var context = {};

var delegation = function (intent, entities) {
    if (context.LiveChat != "Yes") {
        context.LiveChat = "Yes";
        resObject.output.text[0] = "We're connecting you now, please wait for an expert to respond."
    }
    resObject.context = context;
}

var intro = function (intent, entities) {
    if (context.started == 'no') {
        context.started = 'yes'
        context.thisQuestion = 'question'
        context.topic = 'question'
        resObject.context = context
        resObject.output.text[0] = "Hello, I'm Anton and I'm here to help. <br> I see you're looking at TVs. We have all the top brands here, with services like setup and wall mounting to make it easy to start enjoying your new TV! <br> <b>Do you need any help?</b>"
    }
}

var wantTv = function (intent, entities) {
    switch (context.thisQuestion) {
        case 'question':
            context.thisQuestion = 'filter'
            context.topic = 'filter'
            context.priceSlider = true;
            resObject.output.text[0] = 'Cool, lets help you find a TV. <br> First of all, what\'s your budget! <br/>'
            break;
    }
    resObject.context = context;
}

var filter = function (intent, entities) {
    switch (context.thisQuestion) {
        case 'filter':
            if (context.budget) {
                context.thisQuestion = 'pickSize'
                context.tvButton = true;
                resObject.output.text[0] = 'Sweet, I\'ll look for TVs less than $' + context.budget +
                    '. What size are you looking at? <br/>';

            }
            break;
        case 'pickSize':
            if (context.tvSize) {
                context.thisQuestion = 'tvUseFor'
                resObject.output.text[0] = 'Sure, I\'ll look for ' + context.tvSize +
                    ' TVs for you! <br> I see you purchased a PS4 recently.<br> <b>Will you be using it with this new TV?</b>'
            }
            break;
        case 'tvUseFor':
            if (intent == 'Yes') {
                resObject.output.text[0] = 'I\'ll look for the best TVs for gaming!<br> <b>Is there anything else you\'ll be using it for?</b>'
            }
            if (intent == 'watchTv') {
                resObject.output.text[0] = 'I\'ll make sure your TV is optimized for both gaming and watching TV shows! <br> <b>Is there anything else?</b>'
            }
            if (intent == 'No') {
                context.thisQuestion = 'recommend'
                context.topic = 'recommend'
                context.Product = 'Yes'
                context.tvCarousel = true;
                resObject.output.text[0] = 'I\'ve found 3 TVs we recommend, have a look below. <br><b>Please select the one you would like.</b>'
            }
            break;
    }
    resObject.context = context;
}

var recommend = function (intent, entities) {
    context.Completed = "Yes"
    context.topic = "completed"
    context.thisQuestion = "moreInfo"
    resObject.output.text[0] = "Great choice! It\'s an awesome TV. Actually, it\'s our best seller this month! I'll add it to your cart right away. <br> We also offer installation services and TV protection services for this TV. <br> <b>Would you like to know more?</b>"
    resObject.context = context;
}

var completed = function (intent, entities) {
    switch (context.thisQuestion) {
        case 'moreInfo':
            if (intent == "Yes") {
                context.thisQuestion='planSelect';
                resObject.output.text[0] = "Okay, we offer great installation services and TV protection.<br><button id=\'more-info\' >Click here to find out more information</button>"
                context.protectionPlan = true;
            } else {
                resObject.output.text[0] = "No problem. Thank you for choosing to shop with us today.<br><b>I hope you have a great day!<b>"
            }

            break;

        case 'goodbye':
            resObject.output.text[0] = "Thanks for taking the time to speak to me today. <br><b>I hope you have a great day!<b>"

            if (intent == "goodbye") {
                context.closeWindow = true;
            }
            break;

        case 'planSelect':
            console.log("In here");
            resObject.output.text[0]= "Sure I'll add Protection Plan "+context.selectedPlan + " to your cart. <br> Feel free to browse for other products. <br> <b>I\'ll see you at checkout</b>";
            context.thisQuestion = "goodbye";
            break;
    }

    resObject.context = context;
}

var gotoQuestion = function (intent, entities, context) {
    switch (context.topic) {
        case 'intro':
            intro(intent, entities, context);
            break;
        case 'question':
            wantTv(intent, entities);
            break;
        case 'filter':
            filter(intent, entities);
            break;
        case 'recommend':
            recommend(intent, entities);
            break;
        case "Delegation":
            delegation(intent, entities);
            break;
        case "completed":
            completed(intent, entities);
            break;
    }
}

var dialog = function (intent, entities, globalContext) {
    context = globalContext;
    if (intent == "delegate") {
        context.thisQuestion = "delegation";
        context.topic = "Delegation"
    }
    gotoQuestion(intent, entities, globalContext)
    return resObject;
}
module.exports.dialog = dialog
