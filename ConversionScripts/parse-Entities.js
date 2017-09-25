//Takes a WATSON model, extracts the entities, and outputs it in a format expected by LUIS.
//This can then be added to the "entities" object within the LUIS model.
var fs = require ('fs');

var buildObj = {
 entities: []
};

//Name of Watson JSON file
fileName = "Collette-Watson.json"

var obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));

for(var i in obj.entities){
	buildObj.entities.push({name: obj.entities[i].entity});
}

var outJson = JSON.stringify(buildObj, null, 4);

fs.writeFile('luis-entity.json', outJson, 'utf8');