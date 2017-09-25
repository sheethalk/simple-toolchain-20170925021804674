var term = {
  "thirty": 30,
  "twenty nine": 29,
  "twenty eight": 28,
  "twenty seven": 27,
  "twenty six": 26,
  "twenty five": 25,
  "twenty four": 24,
  "twenty three": 23,
  "twenty two": 22,
  "twenty one": 21,
  "twenty": 20,
  "nineteen": 19,
  "eighteen": 18,
  "seventeen": 17,
  "sixteen": 16,
}

var wordsToNum = function(input){
  if(typeof input == String){
    for(var i in term){
      var input = input.replace(i, term[i]);
      var input = input.replace('.', ' ');

    }
  }
  return input;
}

module.exports.wordsToNum = wordsToNum;
