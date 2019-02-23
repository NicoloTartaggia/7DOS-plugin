import "jsbayes";
var jsbayes = require("jsbayes"); //import jbayes
//setting up a mock bayesian network
let dbMonitor : JGraph = jsbayes.newGraph(); 
let queryNum : JNode = dbMonitor.addNode('# of queries', ['0 to 100', '100 to 500', '500 to 1000', 'over 1000']);
let cpuLoad : JNode = dbMonitor.addNode('% of CPU usage', ['0% to 40%', '40% to 80%', '80% to 100%']);
let activeUsers : JNode = dbMonitor.addNode('active concurrent users', ['under 500', 'over or equal to 500']);
let queriesSucceed : JNode = dbMonitor.addNode('db queries succeed', ['true', 'false']);

//connecting nodes
queryNum.addParent(activeUsers);
cpuLoad.addParent(queryNum);
queriesSucceed.addParent(cpuLoad);
queriesSucceed.addParent(queryNum);


dbMonitor.reinit();

activeUsers.cpt = [0.5, 0.5];
queryNum.cpt = [
    [0.3, 0.4, 0.3, 0], // probability for each value of queryNum given activeUsers < 500
    [0.1, 0.1, 0.6, 0.2]  // probability for each value of queryNum given activeUsers >= 500
];
cpuLoad.cpt = [
    [0.8, 0.2, 0], // if 0-100 queries
    [0.2, 0.6, 0.2], //etc
    [0.1, 0.2, 0.7],
    [0, 0.25, 0.75]
];

queriesSucceed.setCpt([
    [1, 0], [0.9, 0.1], [0.6, 0.4], [0.2, 0.8],
    [1, 0], [0.8, 0.2], [0.5, 0.5], [0.1, 0.9],
    [0.5, 0.5], [0.4, 0.6], [0.1, 0.9], [0, 1]
]);

dbMonitor.saveSamples = true;
dbMonitor.sample(1);

console.log("STARTING OUTPUT");
console.log(activeUsers.values[activeUsers.value]);
console.log(cpuLoad.values[cpuLoad.value]);
console.log(cpuLoad.value);
console.log(queryNum.values[queryNum.value]);
console.log(queriesSucceed.value);
console.log("ENDING OUTPUT");