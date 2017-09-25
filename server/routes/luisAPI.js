const entityParser = require('./entityParser');
const https = require('https');
const baseURL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/7fd988f9-6593-4639-bf01-42d7b41203e4?subscription-key=08dc6f1200b44a0998a5265d1eba7cd1&timezoneOffset=0&verbose=true'

//global response from LUIS so i can manipulate in the entity callback
var luisRes
var classify = function(userInput, callback) {

  var query = encodeURI(userInput);
  var fullQuery = baseURL + '&q=' + query;
  console.log("Making GET Request to: " + fullQuery)
  https.get(fullQuery,
    function(res) {
      // console.log("----------LUIS Response-----------")
        
      res.on('data',   (d)  =>  {
        // process.stdout.write(d)
        luisRes = JSON.parse(d)
        entityParser.recogniseEntity(userInput, recogniseEntityCallback);
        //recognise entity call back contains callback for the luis function to build the entity. - AW
        function recogniseEntityCallback(res) {
          //this isn't the best way todo it, however we shoudn't get the situation when this wouldn't be "perfect" - AW
          if (res) {
            console.log("CALLEDBACK")
            if (!luisRes.entities[0]) {
              luisRes.entities[0] = {
                "entity": res
              };
            } else {
              luisRes.entities[1] = {
                "entity": res
              }
            }

          }
          callback(luisRes)
        }

          
      });
    }).on('error',   (e)  =>  {  
    console.error(e);
  }); 
};


//test pushing
//test pushing 2

module.exports.classify = classify;
