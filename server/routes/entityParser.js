

//const of all entities with their synonyms needed
var entities = ["Term", "Full Term", "Mortgage Term", "Term of mortgage" ,"Init Term", "Intro Term", "Introductory Term", "Overpayment", "Overpayments",
"Rate", "Rate Type", "Type of mortgage", "Fees", "Fee"]
//just term var needed to see if
var justTerm = false;
var fullTerm = false;
var initTerm = false;
var overpayment = false;
var rateType = false;
var fees = false;
var entity;
//helper to decide what entity has been recognised
function entityHelper(recognisedEntity){
  //check whats been recognised
  switch (recognisedEntity) {
    case "Term":
    justTerm = true;
    break;
    case "Full Term":
    case "Mortgage Term":
    case "Term of mortgage":
      fullTerm = true;
      break;
    case "Init Term":
    case "Intro Term":
    case "Introductory Term":
    initTerm = true;
    break;
    case "Overpayment":
    case "Overpayments":
    overpayment = true;
    break;
    case "Rate":
    case "Rate Type":
    case "Type of mortgage":
    rateType = true;
    break;
    case "Fees":
    case "Fee":
    fees = true
    break;
    default:
       justTerm = false;
       fullTerm = false;
       initTerm = false;
       overpayment = false;
       rateType = false;
       fees = false;
    break;
  }
  //correctly identify entities
    if((fullTerm | justTerm) && !initTerm){
      entity = "Full Term"
    } else if (initTerm){
      entity = "Init Term"
    } else if(overpayment){
      entity = "Overpayment"
    } else if (rateType){
      entity = "Rate Type"
    } else if (fees){
      entity = "Pay Fees"
    } else {
      entity = null;
    }
}


var recogniseEntity = function(userInput, callback){
  //loop through consts
  for(var i = 0; i < entities.length; i++){
    var input = userInput.toUpperCase();
    var testEntity = entities[i].toUpperCase();
    //compare user input and entity in array both uppercase to ignorecase
    if(input.includes(testEntity)){
      entityHelper(entities[i]);
    }
  }
justTerm = false;
fullTerm = false;
initTerm = false;
overpayment = false;
rateType = false;
fees = false;
callback(entity);
};
module.exports.recogniseEntity = recogniseEntity;
