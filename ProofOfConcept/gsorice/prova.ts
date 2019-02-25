import "jsbayes";
declare var require: any
var jsbayes = require("C:/Users/trogd/git/7DOS-plugin/jsbayesLibrary/jsbayes"); //import jbayes
//setting up a mock bayesian network
let dbMonitor : JGraph = jsbayes.newGraph(); 
let burglary : JNode = dbMonitor.addNode('burglary',  ['false', 'true']);
let earthquake : JNode = dbMonitor.addNode('earthquake',  ['false', 'true']);
let alarm : JNode = dbMonitor.addNode('alarm',  ['false', 'true']);
let johnCalls : JNode = dbMonitor.addNode('johnCalls', ['false', 'true']);
let maryCalls : JNode = dbMonitor.addNode('maryCalls', ['false', 'true']);

//connecting nodes
alarm.addParent(burglary);
alarm.addParent(earthquake);
johnCalls.addParent(alarm);
maryCalls.addParent(alarm);

dbMonitor.reinit();

burglary.cpt = [0.999, 0.001]; // burglary[false,true]
earthquake.cpt = [0.998, 0.002]; //earthquake[false,true]

alarm.setCpt ( [
    [0.999, 0.001], // probability for each value of alarm given burglary=false && earthquake=false
    [0.71, 0.29], // probability for each value of alarm given burglary=false && earthquake=true
    [0.06, 0.94], // probability for each value of alarm given burglary=true && earthquake=false
    [0.05, 0.95], // probability for each value of alarm given burglary=true && earthquake=true
]);
johnCalls.cpt = [
    [0.05, 0.95], // alarm=false
    [0.9, 0.1], // alarm=true
];

maryCalls.cpt = [
    [0.01, 0.99], // alarm=false
    [0.7, 0.3] // alarm=true
];

dbMonitor.saveSamples = true;
dbMonitor.sample(100000);

console.log("STARTING OUTPUT");

console.log('\n'+"burglary OUTPUT");
console.log(burglary.cpt);
console.log(burglary.name);
console.log(burglary.sampledLw);
console.log(burglary.values);
console.log(burglary.probs());


console.log('\n'+"earthquake OUTPUT");
console.log(earthquake.cpt);
console.log(earthquake.name);
console.log(earthquake.sampledLw);
console.log(earthquake.values);
console.log(earthquake.probs());

console.log('\n'+"alarm OUTPUT");
console.log(alarm.cpt);
console.log(alarm.name);
console.log(alarm.sampledLw);
console.log(alarm.values);
console.log(alarm.probs());

console.log('\n'+"johnCalls OUTPUT");
console.log(johnCalls.cpt);
console.log(johnCalls.name);
console.log(johnCalls.sampledLw);
console.log(johnCalls.values);
console.log(johnCalls.probs());

console.log('\n'+"maryCalls OUTPUT");
console.log(maryCalls.cpt);
console.log(maryCalls.name);
console.log(maryCalls.sampledLw);
console.log(maryCalls.values);
console.log(maryCalls.probs());

console.log('\n'+"ENDING OUTPUT");
