//Takes a WATSON model, extracts the intents, and outputs it in a format expected by LUIS.
//This can then be added to the "intents" object within the LUIS model.
var fs = require ('fs');

var buildObj = {
 intents: []
};

//Name of 
fileName = "Collette-Watson.json"

var obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));

for(var i in obj.intents){
	buildObj.intents.push({name: obj.intents[i].intent});
}

var outJson = JSON.stringify(buildObj, null, 4);

fs.writeFile('luis-intents.json', outJson, 'utf8');