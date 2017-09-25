//func to do dialog logic, pass in intent, entities and context
var converse = require("./converse.js");

var resObject = {
  context: {},
  output: {
    text: [""]
  }
}

var context = {}
context.conversing = false

var helpResponseArray = [
  "<br/><br/><b>Do you see what I mean?</b>",
  "<br/><br/><b>Do you see what I mean?</b>",
  "<br/><br/><b>Will this help you decide?</b>",
  "<br/><br/><b>Is that helpful?</b>",
  "<br/><br/><b>Does that make things a bit clearer?</b>",
  "<br/><br/><b>Does that help?</b>",
  "<br/><br/><b>Are you with me?</b>"
]

function intro(intents, entities) {

  //Show intro message if yet to start, or if the user previously said no and wants to start again.
  if (context.started == "no" && context.conversing == false) {
    context.conversing = true;
    context.nextQuestion = "fullTerm";
    resObject.output.text[0] = "Hello " + context.name + ", I'm Collette. <br><br>Congratulations on getting your Agreement in Principle! You're a big step closer to being able to buy your new £" + context.value + " home in " + context.location + ".<br><br>Now we need to talk about your lifestyle and your goals to find the best Mortgage for you. I will ask you a few questions, and your answers will enable me to make a tailor-made recommendation.<br><br><b>Are you ready to get started?</b>";
  } else if (intents[0].intent == "yes") {
    context.started = "yes";
    context.thisQuestion = "fullTerm";
    context.nextQuestion = "rateType";
    context.topic = "FullTerm";
    context.questionAttempt = 0;
    resObject.output.text[0] = "Right then, " + context.name + ", first on our agenda is the term of your mortgage. Based on the Credit and Affordability checks we've done, you could pay off your mortgage over " + context.minTerm + " to " + context.maxTerm + " years. <br/> <br/><b>How many years would you like to have to repay your mortgage?</b> <i><button ng-click='getHelp();' >Here are some tips that might help</button></i>";
  } else if (intents[0].intent == "no") {
    resObject.output.text[0] = "Ok, you can ask me something else if you like. Let me know if you'd like to start again.";
  } else {
    defaultAnswer(intents, entities);
  }

  resObject.context = context;
}

function fullTerm(intents, entities) {

  var topIntent = intents[0].intent

  switch (context.thisQuestion) {

    case "fullTerm":
      if (entities[0] && entities[0].type == "builtin.number") {
        var mortgageTerm = entities[0].entity;
        context.nextQuestion = "rateType";
        if (mortgageTerm >= context.minTerm && mortgageTerm <= context.maxTerm) {
          context['2'] = "Yes";
          context.fullTerm = mortgageTerm;
          context.whyAttempt = 0;
          context.thisQuestion = "fullTermRatCheck"
          context.questionAttempt = 0;
          resObject.output.text[0] = "Great. Can I just check: why did you go for " + mortgageTerm + " years?"
        } else {
          resObject.output.text[0] = "I'm sorry " + context.name + ", the term you have chosen is not within your affordable range! Could you please select a term between " + context.minTerm + " and " + context.maxTerm + " years? <br/><i><button ng-click='getHelp();'>Need Help!<button></i>";
        }

      } else {
        defaultAnswer(intents, entities);
      };
      break;

    case "fullTermRatCheck":
      if ((context.fullTerm <= context.maxShortTerm && context.fullTerm >= context.minShortTerm) && (topIntent == "CanAfford" || topIntent == "PayASAP" || topIntent == "PayLessInterest" || topIntent == "PayLessOverall" || topIntent == "RetirementDate")) {
        resObject.output.text[0] = "Smashing! I've made a note for you. "
        context['2R'] = "Yes";
        context.fullTermRat = topIntent;
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "RateType";
          context.thisQuestion = "rateTypeDiff"
          rateType(intents, entities)
        }
      } else if ((context.fullTerm <= context.maxMedTerm && context.fullTerm >= context.minMedTerm) && (topIntent == "RetirementDate")) {
        resObject.output.text[0] = "Smashing! I've made a note for you. "
        context['2R'] = "Yes";
        context.fullTermRat = topIntent;
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "RateType";
          context.thisQuestion = "rateTypeDiff"
          rateType(intents, entities)
        }
      } else if ((context.fullTerm <= context.maxLongTerm && context.fullTerm >= context.minLongTerm) && (topIntent == "CantAffordHigherPayments" || topIntent == "LowerPayments" || topIntent == "RetirementDate")) {
        resObject.output.text[0] = "Smashing! I've made a note for you. "
        context['2R'] = "Yes";
        context.fullTermRat = topIntent;
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "RateType";
          context.thisQuestion = "rateTypeDiff"
          rateType(intents, entities)
        }
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

function rateType(intents, entities) {
  var topIntent = intents[0].intent;

  switch (context.thisQuestion) {
    case "rateTypeDiff":
      context.nextQuestion = "initTerm"
      context.whyAttempt = 0;
      context.explainAttempt = 0;
      context.questionAttempt = 0;
      context.thisQuestion = "rateType"
      resObject.output.text[0] += "Next we need to decide on the best rate type for you.<br/><br/><b> Do you already know the difference between a Fixed Rate and a Variable Rate mortgage?</b><br/><i></i>";
      break;

    case "rateType":
      if (topIntent == "yes") {
        resObject.output.text[0] = "Fantastic! <br/><br/><b>Which would you prefer? </b>"
        context.thisQuestion = "rateTypeRat"
      } else if (topIntent == "no") {
        context.thisQuestion = "rateTypeRat"
        help(intents, entities)
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "rateTypeRat":
      if (topIntent == "fixedRate") {
        context['3A'] = "Yes"
        context.RateType = "Fixed Rate"
        context.thisQuestion = "rateTypeRatCheck"
        context.questionAttempt = 0
        resObject.output.text[0] = "So, " + context.name + ", why have you chosed a Fixed Rate mortgage?"
      } else if (topIntent == "variableRate") {
        context['3A'] = "Yes"
        context.RateType = "Variable Rate"
        context.thisQuestion = "rateTypeRatCheck"
        context.questionAttempt = 0
        resObject.output.text[0] = "So, " + context.name + ", why have you chosed a Variable Rate mortgage?"
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "rateTypeRatCheck":
      if (context.RateType == "Fixed Rate" && (topIntent == "FixPayments" || topIntent == "IncreasedRates" || topIntent == "LimitedBudget")) {
        context['3AR'] = "Yes";
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        resObject.output.text[0] = "Brilliant, we're on the same page. I'll shortlist Fixed Rate mortgage products for you.<br/><br/>For Fixed Rate mortgages, you can set your initial interest rate for 2, 3, or 5 years. Let's call this the introductory term."
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "InitTerm";
          context.thisQuestion = "initTerm"
          initTerm(intents, entities)
        }
      } else if (context.RateType == "Variable Rate" && (topIntent == "CanAffordFuturePaymentRise" || "NoIncreasedRates" || "VarPayLess")) {
        resObject.output.text[0] = "Brilliant, we're on the same page. I'll shortlist Variable Rate mortgage products for you.<br/><br/>For Variable Rate mortgages, you can set your initial interest rate for 2, 3, or 5 years. Let's call this the introductory term."
        context['3AR'] = "Yes";
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "InitTerm";
          context.thisQuestion = "initTerm"
          initTerm(intents, entities)
        }
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }
  resObject.context = context;
}

function initTerm(intents, entities) {
  var topIntent = intents[0].intent;

  switch (context.thisQuestion) {
    case "initTerm":
      context.whyAttempt = 0;
      context.nextQuestion = "payFee";
      context.thisQuestion = "initTermRat";
      context.questionAttempt = 0;
      context.explainAttempt = 0;
      resObject.output.text[0] = resObject.output.text[0] += "<br/><br/><b>How long would you like your introductory term to be?</b><br/><i><button ng-click='getHelp();'>Here's some more information to help you decide.</button></i>"
      break;

    case "initTermRat":
      if (topIntent == "2Year") {
        context['3B'] = "Yes";
        context.InitTerm = "2-year";
        context.initTerm = "2-year";
        context.questionAttempt = 0;
        context.thisQuestion = "initTermRatCheck";
        resObject.output.text[0] = "Just to check, " + context.name + ": Why did you select a 2-year introductory term?"
      } else if (topIntent == "3Year") {
        context['3B'] = "Yes";
        context.InitTerm = "3-year";
        context.initTerm = "3-year";
        context.questionAttempt = 0;
        context.thisQuestion = "initTermRatCheck";
        resObject.output.text[0] = "Just to check, " + context.name + ": Why did you select a 3-year introductory term?"
      } else if (topIntent == "5Year") {
        context['3B'] = "Yes";
        context.InitTerm = "5-year";
        context.initTerm = "5-year";
        context.questionAttempt = 0;
        context.thisQuestion = "initTermRatCheck";
        resObject.output.text[0] = "Just to check, " + context.name + ": Why did you select a 5-year introductory term?"
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "initTermRatCheck":
      if (context.initTerm == "2-year" && (topIntent == "2yrAvoidERC" || topIntent == "2yrPotentialMove" || topIntent == "2yrReview" || topIntent == "3yrPotentialMove" || topIntent == "3yrReview" || topIntent == "AvoidERC" || topIntent == "IncreasedRates" || topIntent == "NoTieDown" || topIntent == "PotentialMove" || topIntent == "Review" || topIntent == "ReviewSoon" || topIntent == "ShortTermStability")) {
        context['3BR'] = "Yes"
        context.initTermRat = topIntent
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        resObject.output.text[0] = "Right, that makes sense.<br/><br/>"
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "PayFee"
          context.thisQuestion = "payFee"
          payFee(intents, entities)
        }
      } else if (context.initTerm == "3-year" && (topIntent == "3yrAvoidERC" || topIntent == "3yrPotentialMove" || topIntent == "3yrReview" || topIntent == "AvoidERC" || topIntent == "Compromise" || topIntent == "IncreasedRates" || topIntent == "NoTieDown" || topIntent == "PotentialMove" || topIntent == "Review" || topIntent == "ReviewSoon" || topIntent == "ShortTermStability")) {
        context['3BR'] = "Yes"
        context.initTermRat = topIntent
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        resObject.output.text[0] = "Right, that makes sense.<br/><br/>"
        if (context.goneBack) {
          context.goneBack = false
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper();
        } else {
          context.topic = "PayFee"
          context.thisQuestion = "payFee"
          payFee(intents, entities)
        }
      } else if (context.initTerm == "5-year" && (topIntent == "FixLong" || topIntent == "IncreasedRates" || topIntent == "PenaltiesNoProblem" || topIntent == "Review")) {
        context['3BR'] = "Yes"
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        context.initTermRat = topIntent
        resObject.output.text[0] = "Right, that makes sense.<br/><br/>"
        if (context.goneBack) {
          context.goneBack = false;
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper()
        } else {
          context.topic = "PayFee"
          context.thisQuestion = "payFee"
          payFee(intents, entities)
        }
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

function payFee(intents, entities) {

  var topIntent = intents[0].intent

  switch (context.thisQuestion) {
    case "payFee":
      resObject.output.text[0] = resObject.output.text[0] += "Ok, " + context.name + ", next we need to talk about fees. Some mortgage options involve paying a fee to secure the best interest rate. You don't have to pay it immediately though - we can cover the payment options later.<br/><br/><b> So for starters, would you be prepared to pay a fee if it meant paying less money in interest?</b><br/><br/><i><button ng-click='getHelp();'>I can give you some more info if you'd like to learn more. </button></i>";
      context.whyAttempt = 0;
      context.questionAttempt = 0;
      context.explainAttempt = 0;
      context.thisQuestion = "payFeeRat"
      context.nextQuestion = "overpayment"
      break;

    case "payFeeRat":
      if (topIntent == "yes") {
        resObject.output.text[0] = "Thanks, " + context.name + ".<br/><br/><b> Can you just give me a short reason for your choice?</b>"
        context['1A'] = "Yes"
        context.payFee = "Yes"
        context.thisQuestion = "payFeeRatCheck"
        context.questionAttempt = 0;
        context.PayFees = "Yes"
      } else if (topIntent == "no") {
        resObject.output.text[0] = "Thanks, " + context.name + ".<br/><br/><b> Can you just give me a short reason for your choice?</b>"
        context['1A'] = "Yes"
        context.payFee = "No"
        context.thisQuestion = "noFee"
        context.questionAttempt = 0;
        context.PayFees = "No"
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "payFeeRatCheck":
      if (topIntent == "BetterRate" || topIntent == "CanAfford" || topIntent == "CanAffordFee" || topIntent == "LongTermSavings" || topIntent == "PayLessInterest" || topIntent == "PayLessOverall") {
        resObject.output.text[0] = "Smashing - that makes sense. I'll look at Mortgage products with fees for you.<br/><br/>As I said a moment ago, you don't necessarily have to pay the fee straightaway.<br/><br/><b> Would you prefer to pay your fee up front, or would it suit you better to add it to the amount you're borrowing? </b><br/><br/><i><button ng-click='getHelp();'>I've gathered more information that might be helpful.</button></i>"
        context['1AR'] = "Yes";
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        context.topic = "FeeUpfront"
        context.thisQuestion = "feeUpFront"
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "noFee":
      if (topIntent == "AvoidFee" || topIntent == "NoExtraBorrowing" || topIntent == "NotWorthPaying" || topIntent == "NoFeeAvoidInterest") {
        resObject.output.text[0] = "That makes sense. I'll focus my search on Mortgage products without fees for you.<br/><br/>"
        context['1AR'] = "Yes";
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        if (context.goneBack) {
          context.goneBack = false;
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper()
        } else {
          context.topic = "Overpayment"
          context.thisQuestion = "overpayment"
          overpayment(intents, entities);
        }
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

function feeUpFront(intents, entities) {

  var topIntent = intents[0].intent

  switch (context.thisQuestion) {

    case "feeUpFront":
      if (topIntent == "feeUpfront") {
        resObject.output.text[0] = "Great! May I ask why that's your preference " + context.name + "?"
        context["1B"] = "Yes"
        context.feeUpFront = "yes"
        context.FeesUpFront = "Yes"
        context.thisQuestion = "feeUpfrontRatCheck"
        context.questionAttempt = 0
      } else if (topIntent == "feeAdd") {
        resObject.output.text[0] = "Great! May I ask why that's your preference " + context.name + "?"
        context["1B"] = "Yes"
        context.feeUpFront = "no"
        context.FeesUpFront = "No"
        context.thisQuestion = "feeUpfrontRatCheck"
        context.questionAttempt = 0
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "feeUpfrontRatCheck":
      if (context.feeUpFront == "yes" && (topIntent == "AvoidInterestOnFee" || topIntent == "CanAfford" || topIntent == "CanAffordFee" || topIntent == "LongTermSavings" || topIntent == "NoExtraBorrowing" || topIntent == "NoFeeLater" || topIntent == "PayLessOverall" || topIntent == "PayLessInterest")) {
        resObject.output.text[0] = "That makes perfect sense. I'll make a note that you want to add any fees onto your mortgage. "
        context["1BR"] = "Yes"
        context.whyAttempt = 0
        context.explainAttempt = 0
        context.questionAttempt = 0
        if (context.goneBack) {
          context.goneBack = false;
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper()
        } else {
          context.topic = "Overpayment"
          context.thisQuestion = "overpayment"
          overpayment(intents, entities);
        }
      } else if (context.feeUpFront == "no" && (topIntent == "CantAffordNow" || topIntent == "PayMoneyElsewhere" || topIntent == "ShortTermSavings")) {
        resObject.output.text[0] = "That makes perfect sense. I'll make a note that you want to add any fees onto your mortgage."
        context["1BR"] = "Yes"
        context.whyAttempt = 0
        context.explainAttempt = 0
        context.questionAttempt = 0
        if (context.goneBack) {
          context.goneBack = false;
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper()
        } else {
          context.topic = "Overpayment"
          context.thisQuestion = "overpayment"
          overpayment(intents, entities);
        }
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

function overpayment(intents, entities) {

  var topIntent = intents[0].intent;

  switch (context.thisQuestion) {
    case "overpayment":
      context.thisQuestion = "overpaymentRat";
      resObject.output.text[0] += "We're on the home straight " + context.name + " - how exciting! <br/><br/>The mortgages we offer allow you to make limited overpayments each year, without incurring Early Repayment Charges (ERC). Some mortgages have higher overpayment allowances than others. <br/><br/><b>Are you likely to want to make overpayments on your mortgage of more than 5% per year? <br/><br/><i><button ng-click='getHelp();'>Here are some things to think about.</button></i>";
      break;

    case "overpaymentRat":
      if (topIntent == "yes") {
        context.Overpayments = "Yes";
        context.thisQuestion = "overpaymentRatCheck";
        context.questionAttempt = 0;
        context['4'] = "Yes";
        resObject.output.text[0] = "So, " + context.name + " why did you choose that option?";
      } else if (topIntent == "no") {
        context['4'] = "Yes";
        context.Overpayments = "No";
        context.thisQuestion = "overpaymentRatCheck";
        context.questionAttempt = 0;
        resObject.output.text[0] = "So, " + context.name + " why did you choose that option?";
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "overpaymentRatCheck":
      if ((context.Overpayments === "Yes") && (topIntent == "AvoidERC" || topIntent == "AvoidOPCharges" || topIntent == "ExtraIncome" || topIntent == "MaxOPLimit" || topIntent == "PayLessOverall" || topIntent == "PlanningToOP")) {
        context['4R'] = "Yes";
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;

        resObject.output.text[0] = "That's fine. Let's work on the idea that you might want to overpay at some point. ";
        if (context.goneBack) {
          context.goneBack = false;
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper()
        } else {
          context.topic = "Affordability";
          context.thisQuestion = "affordability";
          affordability(intents, entities);
        }

      } else if (context.Overpayments === "No" && (topIntent == "NoBudgetForOP" || topIntent == "OPLessThanFivePercent" || topIntent == "PenaltiesNoProblem" || topIntent == "WillNotOP")) {
        context['4R'] = "Yes";
        context.whyAttempt = 0;
        context.explainAttempt = 0;
        context.questionAttempt = 0;
        resObject.output.text[0] = "That's fine. Let's assume you won't want to make substantial overpayments. ";
        if (context.goneBack) {
          context.goneBack = false;
          context.topic = context.lastTopic;
          context.thisQuestion = context.lastQuestion;
          repeatQuestionHelper()
        } else {
          context.topic = "Affordability";
          context.thisQuestion = "affordability";
          affordability(intents, entities);
        }
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

function affordability(intents, entities) {

  var topIntent = intents[0].intent;

  switch (context.thisQuestion) {
    case "affordability":
      context.nextQuestion = "recommend"
      context.thisQuestion = "affordabilityCheck"
      context.explainAttempt = 0
      resObject.output.text[0] += "There's just one last thing to check... <br/><br/>We have a responsibility to make sure that, based upon the information you tell us, your mortgage will remain affordable both now and in the future.<br/><br/><b> Are you expecting any major changes to your income or expenditure in the foreseeable future?</b><br/><br/><i><button ng-click='getHelp();'>Here's some more info if you're not sure.</button></i>"
      break;

    case "affordabilityCheck":
      if (topIntent == "yes") {
        context['5'] = "Yes"
        delegation(intents, entities)
      } else if (topIntent == "no") {
        context['5'] = "Yes"
        context.Recommend = "Yes"
        context.thisQuestion = "affordabilityRatCheck"
        context.questionAttempt = 0
        resObject.output.text[0] = "Fantastic. Can you just tell me why that's the case?"
      } else {
        defaultAnswer(intents, entities);
      }
      break;

    case "affordabilityRatCheck":
      if (topIntent == "StableIncome") {
        context['5R'] = "Yes"
        context.thisQuestion = "recommend"
        context.topic = "Recommend"
        resObject.output.text[0] = "Perfect! I just wanted to be sure.<br/><br/>"
        recommend(intents, entities);
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

//recommend function
function recommend(intents, entities) {

  var topIntent = intents[0].intent;

  switch (context.thisQuestion) {
    case "recommend":

      var suffixString = "";

      if (context.Product == "Yes" && context.fee == 0) {
        suffixString = "<br/><br/>With all of our discussions in mind, my recommendation for you is our " + context.productName + ". With this product you can make overpayments of up to " + context.overpayments + "% of your outstanding balance per year without charge; beyond this, you will incur Early Repayment Charges of " + context.ercPercent + "%. This mortgage has no arrangement fee.<br/><br/><b>Would you like to continue with this product?</b>"
      } else if (context.Product == "Yes" && context.fee == 999) {
        suffixString = "<br/><br/>With all of our discussions in mind, my recommendation for you is our " + context.productName + ". With this product you can make overpayments of up to " + context.overpayments + "% of your outstanding balance per year without charge; beyond this, you will incur Early Repayment Charges of " + context.ercPercent + "%. This mortgage has an arrangement fee of £" + context.fee + ". <br/><br/><b>Would you like to continue with this product?</b>"
      } else if (context.Product == "No") {
        suffixString = ""
      }

      if (context.payFee == "Yes" && context.Overpayments == "Yes") {
        context.thisQuestion = "recommendConfirm";
        resObject.output.text[0] += "So, " + context.name + ", you'll be pleased to know we're all done! <br/><br/>To recap the main points, you've told me you’d like a " + context.RateType + " mortgage with a term of " + context.fullTerm + " years. You told me you are happy to pay a fee to secure a good interest rate and that you would like the option to make overpayments of more than 5% per year without Early Repayment Charges. Is this correct?"
        resObject.output.text[0] += suffixString
      } else if (context.payFee == "No" && context.Overpayments == "Yes") {
        context.thisQuestion = "recommendConfirm";
        resObject.output.text[0] += "So, " + context.name + ", you'll be pleased to know we're all done! <br/><br/>To recap the main points, you've told me you’d like a " + context.RateType + " mortgage with a term of " + context.fullTerm + " years. You told me you aren't happy to pay a fee to secure a good interest rate and that you would like the option to make overpayments of more than 5% per year without Early Repayment Charges. Is this correct?"
        resObject.output.text[0] += suffixString
      } else if (context.payFee == "Yes" && context.Overpayments == "No") {
        context.thisQuestion = "recommendConfirm";
        resObject.output.text[0] += "So, " + context.name + ", you'll be pleased to know we're all done! <br/><br/>To recap the main points, you've told me you’d like a " + context.RateType + " mortgage with a term of " + context.fullTerm + " years. You told me you are happy to pay a fee to secure a good interest rate and that you don't need the option to make overpayments of more than 5% per year without Early Repayment Charges. Is this correct?"
        resObject.output.text[0] += suffixString
      } else if (context.payFee == "No" && context.Overpayments == "No") {
        context.thisQuestion = "recommendConfirm";
        resObject.output.text[0] += "So, " + context.name + ", you'll be pleased to know we're all done! <br/><br/>To recap the main points, you've told me you’d like a " + context.RateType + " mortgage with a term of " + context.fullTerm + " years. You told me you aren't happy to pay a fee to secure a good interest rate and that you don't need the option to make overpayments of more than 5% per year without Early Repayment Charges. Is this correct?"
        resObject.output.text[0] += suffixString
      }
      break;

    case "recommendConfirm":
      if (topIntent == "yes") {
        context.Completed = "Yes"
        resObject.output.text[0] = "Fantastic! I've made a note of your product choice - you can complete your application on the next page. <br/><br/> <i><button ng-click=\"contineProd()\">Click here to continue.</button></i>"
      } else if (topIntent == "no") {
        context.Completed = "No"
        resObject.output.text[0] = "That's a shame. Feel free to talk to me again anytime soon. Or let me know if you'd like to start again."
      } else {
        defaultAnswer(intents, entities);
      }
      break;
  }

  resObject.context = context;
}

function getRandomHelpResponse() {
  return helpResponseArray[Math.floor(Math.random() * helpResponseArray.length)]
}

function help(intents, entities) {
  var topIntent = intents[0].intent;
  console.log("helping " + context.thisQuestion)
  switch (context.thisQuestion) {
    case "fullTermRatCheck":
      if (!context.helpConfirm) {

        var fullRatResponses = [
          "If you go for a shorter term, you'll end up paying less interest over the lifetime of the mortgage, but your monthly payments will be higher. <br/><br/>The flip-side is that a longer term means you will pay more interest over the lifetime of the mortgage, but your monthly payments will be lower.",
          "I know it's hard to imagine, but have a think about your future. Would you like to be mortgage-free by a certain age or event, like your planned retirement date? <br/> <br/>If your income is limited, it might be better to choose a longer term so that you can keep your monthly payments lower.",
          "At this point, I think it's important to consider the ways in which your life could change over the coming decades, as well as your lifestyle. <br/><br/>Maybe ask yourself questions like: When do you hope to retire? Do you have children, or are you considering starting a family? Have you thought about paying for university, if they go down that route? When do you expect you'll relocate again? Do you want to spend money seeing the world?"
        ]

        resObject.output.text[0] = fullRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['2H'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"

      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "Great. Can I just check: why did you go for " + context.fullTerm + " years?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "rateTypeRatCheck":
      if (!context.helpConfirm) {

        var rateRatResponses = [
          "A fixed rate mortgage would make your monthly payments predictable, because the interest rate would be set for a number of years. <br/><br/> A Tracker mortgage is a Variable Rate mortgage because it \"tracks\" the Bank of England Base Rate. In other words, your payments would go up or down in line with the Base Rate. <br/><br/> <i><b>Did you know:</i></b><br/>The Bank of England Base Rate (or BOEBR) is the benchmark for interest rates in the UK and is reviewed on a monthly basis. ",
          "Here's a helpful video <br/><iframe width=\"95%\" height=\"95%\" src=\"https://www.youtube.com/embed/tEUI-FwJ9uE?start=240&amp;end=331&amp;version=3&amp;autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
          "Fixed Rate mortgages usually come with a higher interest rate than a Variable Rate mortgage. This is due to the interest percentage being fixed over a period of time, which gives you peace of mind. <br/><br/> Variable Rate mortgages could cost you less over the lifetime of your mortgage, depending on what happens to the Bank of England Base Rate. This is where the risk thing comes in! If you are able to accept a potential increase in your monthly mortgage payment, you could find yourself paying less interest overall. "
        ]

        resObject.output.text[0] = rateRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['3AH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "So, " + context.name + ", why have you chosen a " + context.RateType + " mortgage?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "initTermRatCheck":
      if (!context.helpConfirm) {

        var initTermRatResponses = [
          "Whether you pick a Variable Rate or Fixed Rate mortgage, choosing a shorter introductory term will offer a cheaper interest rate for that period of time, but it's impossible to predict what rate would follow after the introductory term finishes. ",
          "Medium to longer introductory terms - particularly Fixed Rates - have higher interest rates but they'll make your payments predictable for a longer time, which may help with your budgeting.<br/><br/><b>Most stable: <br/></b>Fixed Rate, with a 5-year introductory term. <br/><b>Least stable: </b><br/>Variable Rate, with a 2-year introductory term. ",
          "Typically, Early Repayment Charges will apply during the introductory term of a mortgage. If you might make large additional payments to your mortgage or would prefer to have more options around clearing the balance, then a shorter introductory term may be better for you."
        ]

        resObject.output.text[0] = initTermRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['3BH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "So " + context.name + ", why did you choose a " + context.initTerm + " introductory term?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;
    case "noFee":
    case "payFeeRatCheck":
      if (!context.helpConfirm) {

        var payFeeRatResponses = [
          "Typically, mortgage products that don't involve a fee are on a higher interest rate.",
          "Paying a fee to secure a cheaper rate could save you money over the lifetime of your mortgage. It's worth weighing up the fee with the size and term of the mortgage you are considering to decide whether it's worth investing in the fee in order to save further down the line.",
          "You may prefer not to pay a fee in order to keep the costs associated with the mortgage as low as possible, especially if you're already stretching your budget."
        ]

        resObject.output.text[0] = payFeeRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['1AH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          if (context.PayFees == "Yes") {
            resObject.output.text[0] = "So, " + context.name + ", can you explain why you're prepared to pay a fee?"
          } else {
            resObject.output.text[0] = "So, " + context.name + ", can you explain why you're not prepared to pay a fee?"
          }
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "feeUpfrontRatCheck":
      if (!context.helpConfirm) {

        var feeUpfrontRatResponses = [
          "If you decide to add the fee to the amount you're borrowing, the cost will be spread across the term of your mortgage. Obviously this removes the need to find the cash immediately but it's worth noting that this means you'll pay interest on it.",
          "If you are able to pay your fee up front, you will save money in the long term as it won't gather interest.",
          "Here’s a worked example which might help you. Let's assume the fee for your chosen mortgage was £999 and you were borrowing £100,000 over 25 years with an interest rate of 3.79%.<br/><i>(Note that in reality this rate would only apply for the initial period rather than the whole mortgage term.)</i><br/><br/>Paying the fee up front would result in a total borrowing of £100,000 and you would pay back £155,892 over the lifetime of the mortgage. Adding on the fee would increase the amount borrowed to £100,999 so the total amount payable would be £156,441. This means that over the lifetime of the mortgage you would pay an extra £549 in interest if you chose to add the fee to the amount you borrowed."
        ]

        resObject.output.text[0] = feeUpfrontRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['1BH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "Can you give me a short reason for your choice?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "overpaymentRatCheck":
      if (!context.helpConfirm) {

        var overpaymentRatResponses = [
          "If you receive a windfall of some kind, it's possible to pay off a chunk of your mortgage. This means you will become mortgage-free sooner, and also reduce the total amount of interest. <br/><br/>That said, if you overpay more than we agree when we set up your mortgage, you could be charged Early Repayment Charges.",
          "Some products let you repay an extra 5% of the outstanding amount per year without charge. This could be done by overpaying a little each month (say, if you get a payrise) or by paying off a lump sum if you have a windfall. <br/><br/>A few products (usually not Fixed Rates) allow you to repay as much as you like without incurring ERC.",
          "If you expect to receive lump sums (e.g. commission/bonus, inheritance) during your introductory term and you think you'll want to use it to pay off more of your mortgage, then you should consider building in the flexibility to overpay more than 5% of the outstanding mortgage per year."
        ]

        resObject.output.text[0] = overpaymentRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['4H'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "<b>So " + context.name + ",  why did you choose that option?</b><br/><br/><i><button ng-click='getHelp();'>Here are some tips that might help</button></i>"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "affordabilityRatCheck":
      if (!context.helpConfirm) {

        var affordabilityRatResponses = [
          "If you become unable to keep up with your repayments, we might be forced to 'repossess' your property. This means the bank would take ownership of the property to get our money back. It's not very nice and we really don't want to do it, so we just want to be sure we offer you a mortgage that is affordable now, and will continue to be affordable in the future. ",
          "If your income is likely to decrease, or your cost of living is likely to increase, this will affect your ability to make your mortgage payments.<br/><br/>We need to understand any expected changes in your financial situation so that we offer you a mortgage you can reasonably afford to repay.",
          "Think about your current sources of income and what you spend your money on at the moment. If there are any changes in your life coming up that could affect your financial situation, we need to be sure that you can still keep up with your mortgage payments."
        ]

        resObject.output.text[0] = affordabilityRatResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "<b>So, " + context.name + ", can you explain your rationale?</b>"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "fullTerm":
      if (!context.helpConfirm) {

        var fullTermResponses = [
          "If you go for a shorter term, you'll end up paying less interest over the lifetime of the mortgage, but your monthly payments will be higher. <br/><br/>The flip-side is that a longer term means you will pay more interest over the lifetime of the mortgage, but your monthly payments will be lower.",
          "I know it's hard to imagine, but have a think about your future. Would you like to be mortgage-free by a certain age or event, like your planned retirement date? <br/> <br/>If your income is limited, it might be better to choose a longer term so that you can keep your monthly payments lower.",
          "At this point, I think it's important to consider the ways in which your life could change over the coming decades, as well as your lifestyle. <br/><br/>Maybe ask yourself questions like: When do you hope to retire? Do you have children, or are you considering starting a family? Have you thought about paying for university, if they go down that route? When do you expect you'll relocate again? Do you want to spend money seeing the world?"
        ]

        resObject.output.text[0] = fullTermResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "So, " + context.name + ", what's the length of your preferred mortgage term?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "rateType":
    case "rateTypeRat":
      if (!context.helpConfirm) {

        var rateTypeResponses = [
          "A fixed rate mortgage would make your monthly payments predictable, because the interest rate would be set for a number of years. <br/><br/> A Tracker mortgage is a Variable Rate mortgage because it \"tracks\" the Bank of England Base Rate. In other words, your payments would go up or down in line with the Base Rate. <br/><br/> <i><b>Did you know:</i></b><br/>The Bank of England Base Rate (or BOEBR) is the benchmark for interest rates in the UK and is reviewed on a monthly basis. ",
          "Here's a helpful video <br/><iframe width=\"95%\" height=\"95%\" src=\"https://www.youtube.com/embed/tEUI-FwJ9uE?start=240&amp;end=331&amp;version=3&amp;autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
          "Fixed Rate mortgages usually come with a higher interest rate than a Variable Rate mortgage. This is due to the interest percentage being fixed over a period of time, which gives you peace of mind. <br/><br/> Variable Rate mortgages could cost you less over the lifetime of your mortgage, depending on what happens to the Bank of England Base Rate. This is where the risk thing comes in! If you are able to accept a potential increase in your monthly mortgage payment, you could find yourself paying less interest overall. "
        ]

        resObject.output.text[0] = rateTypeResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['3AH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "Would you prefer a Fixed Rate or a Variable Rate mortgage?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "initTermRat":
      if (!context.helpConfirm) {

        var initTermResponses = [
          "Whether you pick a Variable Rate or Fixed Rate mortgage, choosing a shorter introductory term will offer a cheaper interest rate for that period of time, but it's impossible to predict what rate would follow after the introductory term finishes. ",
          "Medium to longer introductory terms - particularly Fixed Rates - have higher interest rates but they'll make your payments predictable for a longer time, which may help with your budgeting.<br/><br/><b>Most stable: <br/></b>Fixed Rate, with a 5-year introductory term. <br/><b>Least stable: </b><br/>Variable Rate, with a 2-year introductory term. ",
          "Typically, Early Repayment Charges will apply during the introductory term of a mortgage. If you might make large additional payments to your mortgage or would prefer to have more options around clearing the balance, then a shorter introductory term may be better for you."
        ]

        resObject.output.text[0] = initTermResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['3BH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "Would you like to set your initial interest for 2, 3, or 5 years?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "payFeeRat":
      if (!context.helpConfirm) {

        var payFeeResponses = [
          "Typically, mortgage products that don't involve a fee are on a higher interest rate.",
          "Paying a fee to secure a cheaper rate could save you money over the lifetime of your mortgage. It's worth weighing up the fee with the size and term of the mortgage you are considering to decide whether it's worth investing in the fee in order to save further down the line.",
          "You may prefer not to pay a fee in order to keep the costs associated with the mortgage as low as possible, especially if you're already stretching your budget."
        ]

        resObject.output.text[0] = payFeeResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['1AH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "So, " + context.name + ", would you be prepared to pay a fee if it meant paying less money in interest?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "feeUpfrontRat":
      if (!context.helpConfirm) {

        var feeUpfrontResponses = [
          "If you decide to add the fee to the amount you're borrowing, the cost will be spread across the term of your mortgage. Obviously this removes the need to find the cash immediately but it's worth noting that this means you'll pay interest on it.",
          "If you are able to pay your fee up front, you will save money in the long term as it won't gather interest.",
          "Here’s a worked example which might help you. Let's assume the fee for your chosen mortgage was £999 and you were borrowing £100,000 over 25 years with an interest rate of 3.79%.<br/><i>(Note that in reality this rate would only apply for the initial period rather than the whole mortgage term.)</i><br/><br/>Paying the fee up front would result in a total borrowing of £100,000 and you would pay back £155,892 over the lifetime of the mortgage. Adding on the fee would increase the amount borrowed to £100,999 so the total amount payable would be £156,441. This means that over the lifetime of the mortgage you would pay an extra £549 in interest if you chose to add the fee to the amount you borrowed."
        ]

        resObject.output.text[0] = feeUpfrontResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['1BH'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "You can either pay your fee up front or add it to the amount you're borrowing. Which would you prefer?"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "overpaymentRat":
      if (!context.helpConfirm) {

        var overpaymentResponses = [
          "If you receive a windfall of some kind, it's possible to pay off a chunk of your mortgage. This means you will become mortgage-free sooner, and also reduce the total amount of interest. <br/><br/>That said, if you overpay more than we agree when we set up your mortgage, you could be charged Early Repayment Charges.",
          "Some products let you repay an extra 5% of the outstanding amount per year without charge. This could be done by overpaying a little each month (say, if you get a payrise) or by paying off a lump sum if you have a windfall. <br/><br/>A few products (usually not Fixed Rates) allow you to repay as much as you like without incurring ERC.",
          "If you expect to receive lump sums (e.g. commission/bonus, inheritance) during your introductory term and you think you'll want to use it to pay off more of your mortgage, then you should consider building in the flexibility to overpay more than 5% of the outstanding mortgage per year."
        ]

        resObject.output.text[0] = overpaymentResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context['4H'] = context.explainAttempt + 1
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "<b>Ok, " + context.name + ", so would you like the option to make overpayments of more than 5% per year? </b><br/><br/><i><button ng-click='getHelp();'>Here are some tips that might help</button></i>"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

    case "affordabilityCheck":
      if (!context.helpConfirm) {

        var affordabilityResponses = [
          "If you become unable to keep up with your repayments, we might be forced to 'repossess' your property. This means the bank would take ownership of the property to get our money back. It's not very nice and we really don't want to do it, so we just want to be sure we offer you a mortgage that is affordable now, and will continue to be affordable in the future. ",
          "If your income is likely to decrease, or your cost of living is likely to increase, this will affect your ability to make your mortgage payments.<br/><br/>We need to understand any expected changes in your financial situation so that we offer you a mortgage you can reasonably afford to repay.",
          "Think about your current sources of income and what you spend your money on at the moment. If there are any changes in your life coming up that could affect your financial situation, we need to be sure that you can still keep up with your mortgage payments."
        ]

        resObject.output.text[0] = affordabilityResponses[context.explainAttempt]
        resObject.output.text[0] += getRandomHelpResponse();
        context.explainAttempt += 1
        context.helpConfirm = true;
        context.helpTopic = context.topic;
        context.topic = "Help"
      } else {
        if (topIntent == "yes") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          resObject.output.text[0] = "<b>So, " + context.name + ", are you expecting any changes in the foreseeable future that might affect your ability to make your mortgage payments? </b>"
        } else if (topIntent == "no" || topIntent == "help") {
          context.topic = context.helpTopic;
          context.helpConfirm = false;
          help(intents, entities);
        }
      }
      break;

  }

  resObject.context = context;
}

function delegation(intents, entities) {

  topIntent = intents[0].intent;

  if (context.thisQuestion !== "delegation") {
    resObject.output.text[0] = "I'm sorry " + context.name + ", I want to make sure we get this absolutely right, so I think the best next step is for one of our Mortgage Advisors to talk this through with you in more detail.<br><br><b>Would you like me to connect you to a colleague?</b>";
    context.thisQuestion = "delegation";
    context.topic = "Delegation"
  } else if (context.thisQuestion == "delegation") {
    if (topIntent == "yes") {
      context.LiveChat = "Yes";
      resObject.output.text[0] = "We're connecting you now, please wait for an expert to respond."
    } else if (topIntent == "no") {
      resObject.output.text[0] = "I'm sorry I couldn't help you today. You can talk to me again at any time."
    }
  }
  resObject.context = context;
}

function goBack(intents, entities) {
  console.log("Gb called")
  var topIntent = intents[0].intent;
  if (topIntent == "yes") {
    context.thisQuestion = context.questionBackTo;
    context.topic = context.backTo;
    resObject.output.text[0] = "Cool, lets jump back!"
    switch (context.thisQuestion) {
      case "fullTerm":
        context['2'] = "No";
        context['2R'] = "No";
        break;
      case "initTermRat":
        context['3B'] = "No";
        context['3BR'] = "No"
        break;
      case "overpaymentRat":
        context['4'] = "No";
        context['4R'] = "No";
        break;
      case "rateTypeRat":
        context['3A'] = "No";
        context['3AR'] = "No";
        break;
      case 'payFeeRat':
        context['1A'] = "No";
        context['1AR'] = "No";
        break;
    }
    resObject.context = context;
    repeatQuestionHelper();
  } else if (topIntent == "no") {
    context.thisQuestion = context.lastQuestion;
    context.topic = context.lastTopic;
    resObject.output.text[0] = "";
    context.goneBack = false;
    //switch case to clear vars!!

    resObject.context = context;
    repeatQuestionHelper();
  } else {
    defaultAnswer(intents, entities);
  }
  resObject.context = context;
}
//check if they actually want to go back!
function goBackCheck(intents, entities) {
  var entity;
  context.goneBack = true;
  if (entities && entities[0]) {
    entity = entities[0].entity;
  }
  switch (entity) {
    case "Full Term":
      console.log("FullTerm GB");
      //save the quesiton they were on
      context.lastQuestion = context.thisQuestion;
      context.lastTopic = context.topic;
      context.topic = "goBack";
      context.backTo = "FullTerm";
      context.questionBackTo = "fullTerm";
      resObject.output.text[0] = "You can change your answer for this question. <br/><br/> If you\'d like to change your answer for the full term question?"
      resObject.context = context;
      break;
    case "Init Term":
      console.log("IniT GB")
      context.lastQuestion = context.thisQuestion;
      context.lastTopic = context.topic;
      context.topic = "goBack";
      context.backTo = "InitTerm";
      context.questionBackTo = "initTermRat";
      resObject.output.text[0] = "You can change your answer for this question. <br/><br/> If you\'d like to change your answer for the introductory term question?"
      resObject.context = context;
      break;
    case "Overpayment":
      console.log("OverPay GB")
      context.lastQuestion = context.thisQuestion;
      context.lastTopic = context.topic;
      context.topic = "goBack";
      context.backTo = "Overpayment";
      context.questionBackTo = "overpaymentRat";
      resObject.output.text[0] = "You can change your answer for this question. <br/><br/> If you\'d like to change your answer for the overpayments question?"
      resObject.context = context;
      break;
    case "Rate Type":
      console.log("RaTe GB")
      context.lastQuestion = context.thisQuestion;
      context.lastTopic = context.topic;
      context.topic = "goBack";
      context.backTo = "RateType";
      context.questionBackTo = "rateTypeRat";
      resObject.output.text[0] = "You can change your answer for this question. <br/><br/> If you\'d like to change your answer for the rate type question?"
      resObject.context = context;
      break;
    case "Pay Fees":
      console.log("FeePay GB");
      context.lastQuestion = context.thisQuestion;
      context.lastTopic = context.topic;
      context.topic = "goBack";
      context.backTo = "PayFee";
      context.questionBackTo = "payFeeRat";
      resObject.output.text[0] = "You can change your answer for this question. <br/><br/> Would you like to change your answer for the fees question?"
      resObject.context = context;
  }
}


function repeatQuestionHelper() {
  if (resObject.output.text[0] != "") {
    resObject.output.text[0] += "<br/><br/>"
  }
  console.log("REPEATING ON! " + context.thisQuestion);
  switch (context.thisQuestion) {
    case "fullTerm":
      resObject.output.text[0] += "So, " + context.name + ", what's the legnth of your preferred mortgage term?"
      break;
    case "fullTermRatCheck":
      resObject.output.text[0] += "Great. Can I just check: why did you go for " + context.fullTerm + " years?"
      break;
      //extra cases of rateType && rateTypeDiff to send them into the right section using rateTypeRat, repeated for others
    case "rateTypeRat":
    case "rateType":
    case "rateTypeDiff":
      context.thisQuestion = "rateTypeRat"
      resObject.output.text[0] += "Would you prefer a Fixed Rate or a Variable Rate mortgage?"
      break;
    case "rateTypeRatCheck":
      resObject.output.text[0] += "So, " + context.name + ", why have you chosen a " + context.RateType + " mortgage?"
      break;
    case "initTermRat":
    case "initTerm":
      context.thisQuestion = "initTermRat";
      resObject.output.text[0] += "Would you like to set your initial interest for 2, 3, or 5 years?"
      break;
    case "initTermRatCheck":
      resObject.output.text[0] += "So, " + context.name + ", why did you choose a " + context.initTerm + " introductory term?"
      break;
    case "payFeeRat":
    case "payFee":
      context.thisQuestion = "payFeeRat"
      resObject.output.text[0] += "So, " + context.name + ", would you be prepared to pay a fee if it meant paying less money in interest?"
      break;
    case "payFeeRatCheck":
      resObject.output.text[0] += "So, " + context.name + ", can you explain why you're prepared to pay a fee?"
      break;
    case "noFee":
      resObject.output.text[0] += "So, " + context.name + ", can you explain why you're not prepared to pay a fee?"
    case "feeUpFront":
      resObject.output.text[0] += "You can either pay your fee up front or add it to the amount you're borrowing. Which would you prefer?"
      break;
    case "feeUpFrontRatCheck":
      resObject.output.text[0] += "Can you give me a short reason for your choice ?"
      break;
    case "overpaymentRat":
    case "overpayment":
      context.thisQuestion = "overpaymentRat";
      resObject.output.text[0] += "<b>Ok, " + context.name + ", so would you like the option to make overpayments of more than 5% per year? </b><br/><br/><i><button ng-click='getHelp();'>Here are some tips that might help</button></i>"
      break;
    case "overpaymentRatCheck":
      resObject.output.text[0] += "<b>So, " + context.name + ",  why did you choose that option?</b><br/><br/><i><button ng-click='getHelp();'>Here are some tips that might help</button></i>"
      break;
    case "affordabilityCheck":
      resObject.output.text[0] += "<b>So, " + context.name + ", are you expecting any changes in the foreseeable future that might affect your ability to make your mortgage payments? </b>"
      break;
    case "affordabilityRatCheck":
      resObject.output.text[0] += "<b>So, " + context.name + ", can you explain your rationale ?</b>"
      break;
  }
}

function whyAsk(intents, entities) {
  var whyAskLevels = [
    "I just need to check that you fully understand what you're signing up to.",
    "To make sure I'm acting in your best interests, I need to check you understand the implications of your decision.",
    "I have the responsibility to make sure you know the details of each of your choices so I can find a mortgage that's suitable for your circumstances."
  ]
  if (context.whyAttempt < 3) {
    if (context.thisQuestion.includes('RatCheck')) {
      resObject.output.text[0] = whyAskLevels[context.whyAttempt];
      context.whyAttempt++;
      repeatQuestionHelper();
    } else {
      defaultAnswer(intents, entities);
    }
  } else {

    delegation(intents, entities);
  }
  resObject.context = context;
}

function defaultAnswer(intents, entities) {
  if (context.questionAttempt <= 2) {
    context.questionAttempt++;
    resObject.output.text[0] = "I'm sorry " + context.name + ", I don't understand what you mean. <br/><br/><b>Please will you try to explain another way?</b>"
  } else {
    delegation(intents, entities);
  }
  resObject.context = context;
};

function global(intents, entities) {
  var topIntent = intents[0].intent;

  switch (topIntent) {
    case "None":
      defaultAnswer(intents, entities);
      break;
    case "help":
      help(intents, entities);
      break;
    case "whyAsk":
      whyAsk(intents, entities);
      break;
    case "goBack":
      goBackCheck(intents, entities);
      break;
  }
}

//SWTICH CASE xD
function gotoQuestion(intents, entities) {
  console.log(context.topic)
  switch (context.topic) {
    case "intro":
      intro(intents, entities);
      break;
    case "FullTerm":
      fullTerm(intents, entities);
      break;
    case "RateType":
      rateType(intents, entities);
      break;
    case "InitTerm":
      initTerm(intents, entities);
      break;
    case "PayFee":
      payFee(intents, entities);
      break;
    case "FeeUpfront":
      feeUpFront(intents, entities);
      break;
    case "Overpayment":
      overpayment(intents, entities);
      break;
    case "Affordability":
      affordability(intents, entities);
      break;
    case "Recommend":
      recommend(intents, entities);
      break;
    case "Delegation":
      delegation(intents, entities);
      break;
    case "Help":
      help(intents, entities)
      break;
    case "goBack":
      goBack(intents, entities);
      break;
  }
};

var dialog = function(intents, entities, globalContext) {

  context = globalContext;
  if (intents[0]) {
    console.log(intents[0].intent)
  }
  //checking confidence level if <.4 reject
  if (intents[0] && intents[0].score < 0.6) {
    intents[0].intent = 'None';
    intents[0].score = 1;
  }

  if (intents[0] && ['help', 'whyAsk', 'goBack', 'startAgain', 'None'].indexOf(intents[0].intent) != -1) {
    global(intents, entities);
  } else {
    gotoQuestion(intents, entities);
  }
  return resObject;
};

module.exports.dialog = dialog;
