//Takes a WATSON model, extracts the utterances, and outputs it in a format expected by LUIS.
//This can then be added to the "utterances" object within the LUIS model.
var fs = require ('fs');

var buildObj = {
 utterances: []
};

//Name of Watson JSON file
fileName = "Collette-Watson.json"

var obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));

for(var i in obj.intents){
	for(j in obj.intents[i].examples){
		buildObj.utterances.push({text: obj.intents[i].examples[j].text, intent: obj.intents[i].intent, entities: []});
	}
}

var outJson = JSON.stringify(buildObj, null, 4);

fs.writeFile('luis-utterance.json', outJson, 'utf8');