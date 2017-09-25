 //Takes a WATSON model, extracts the dialog, and outputs it in a structured format which can be used with our Node implmentation.
var fs = require ('fs');

var buildObj = {
 dialog: []
};

//Name of Watson JSON file
fileName = "Collette-Watson.json"

const obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));

//The current node being looked at from the Watson Model dialog array
var currNode;

//The index of the current node being looked at from the Watson model dialog array
var currNodeIndex;

//ID of current Dialog Node being looked at.
var currDialogNode;

//Flag used to control when for loop ends
var changeLastIter = true;

function dialogNodeInArray(node){
	for(var i in node){
		// console.log("Looking at: "+node[i].dialog_node+" Compared to: "+currDialogNode)
		if (node[i].dialog_node == currDialogNode){
			console.log("Dialog node already in here!")
		}
	}
}

function examineProperty(key,value) {
	if(key == "dialog_node"){
		currDialogNode = value;
	} else if(key == "children" && currNode.parent == currDialogNode){ 
		dialogNodeInArray(value);
		// console.log("Pushing dialog node: "+currNode.dialog_node+" with output: "+currNode.output.text)
		value.push({dialog_node: currNode.dialog_node, conditions: currNode.conditions, context: currNode.context, output: currNode.output, go_to: currNode.go_to, previous_sibling: currNode.previous_sibling, children: []})
		obj.dialog_nodes.splice(currNodeIndex, 1);
		changeLastIter = true
	}
}

function traverseBuildChildren(o,func) {
    for (var i in o) {
        func.apply(this,[i,o[i]]);  
        if (o[i] !== null && typeof(o[i])=="object") {
            traverseBuildChildren(o[i],func);
        }
    }
}

//Form the root dialog nodes
for(var i in obj.dialog_nodes){
	currNode = obj.dialog_nodes[i]
	if (obj.dialog_nodes[i].parent == null){
		buildObj.dialog.push({dialog_node: currNode.dialog_node, conditions: currNode.conditions, context: currNode.context, output: currNode.output, go_to: currNode.go_to, children: []});
		obj.dialog_nodes.splice(i, 1);
	}
}

while(changeLastIter == true){	
	changeLastIter = false;
	for(var i in obj.dialog_nodes){
		currNode = obj.dialog_nodes[i]
		currNodeIndex = i;
		traverseBuildChildren(buildObj.dialog, examineProperty);
	}
}

var outJson = JSON.stringify(buildObj, null, 2);

fs.writeFile('msbot-dialog.json', outJson, 'utf8');