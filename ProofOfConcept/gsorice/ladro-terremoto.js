"use strict";
exports.__esModule = true;
require("jsbayes");
var jsbayes = require("jsbayes"); //import jbayes
//setting up a mock bayesian network
var dbMonitor = jsbayes.newGraph();
var burglary = dbMonitor.addNode('burglary', ['false', 'true']);
var earthquake = dbMonitor.addNode('earthquake', ['false', 'true']);
var alarm = dbMonitor.addNode('alarm', ['false', 'true']);
var johnCalls = dbMonitor.addNode('johnCalls', ['false', 'true']);
var maryCalls = dbMonitor.addNode('maryCalls', ['false', 'true']);
//connecting nodes
alarm.addParent(burglary);
alarm.addParent(earthquake);
johnCalls.addParent(alarm);
maryCalls.addParent(alarm);
dbMonitor.reinit();
burglary.cpt = [0, 1]; // burglary[false,true]
earthquake.cpt = [0, 1]; //earthquake[false,true]
alarm.setCpt([
    [0.999, 0.001],
    [0.71, 0.29],
    [0.06, 0.94],
    [0.05, 0.95],
]);
johnCalls.cpt = [
    [0.95, 0.05],
    [0.1, 0.9],
];
maryCalls.cpt = [
    [0.99, 0.01],
    [0.3, 0.7] // alarm=true
];
dbMonitor.saveSamples = true;
dbMonitor.sample(1000000);
console.log("STARTING OUTPUT");
console.log('\n' + "burglary OUTPUT");
console.log(burglary.cpt);
console.log(burglary.name);
console.log(burglary.sampledLw);
console.log(burglary.values);
console.log(burglary.probs());
console.log('\n' + "earthquake OUTPUT");
console.log(earthquake.cpt);
console.log(earthquake.name);
console.log(earthquake.sampledLw);
console.log(earthquake.values);
console.log(earthquake.probs());
console.log('\n' + "alarm OUTPUT");
console.log(alarm.cpt);
console.log(alarm.name);
console.log(alarm.sampledLw);
console.log(alarm.values);
console.log(alarm.probs());
console.log('\n' + "johnCalls OUTPUT");
console.log(johnCalls.cpt);
console.log(johnCalls.name);
console.log(johnCalls.sampledLw);
console.log(johnCalls.values);
console.log(johnCalls.probs());
console.log('\n' + "maryCalls OUTPUT");
console.log(maryCalls.cpt);
console.log(maryCalls.name);
console.log(maryCalls.sampledLw);
console.log(maryCalls.values);
console.log(maryCalls.probs());
console.log('\n' + "ENDING OUTPUT");
