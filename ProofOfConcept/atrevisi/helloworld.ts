import "../../jsbayesLibrary";
var jsbayes = require("../../jsbayesLibrary/jsbayes");
//setting up a mock bayesian network
let grassMonitor: JGraph = jsbayes.newGraph();
let isRaining: JNode = grassMonitor.addNode("isRaining", ["true", "false"]);
let sprinklerOn: JNode = grassMonitor.addNode("sprinklerOn", ["true", "false"]);
let grassWet: JNode = grassMonitor.addNode("grassWet", ["true", "false"]);
//connecting nodes
grassWet.addParent(isRaining);
grassWet.addParent(sprinklerOn);

grassMonitor.reinit();

isRaining.setCpt([0.5, 0.5]);
sprinklerOn.setCpt([0.2, 0.8]);
grassWet.setCpt([
    [0.9, 0.1], [0.6, 0.4], 
    [0.7, 0.3], [0.5, 0.5]
]);

grassMonitor.observe("isRaining", "true");
grassMonitor.observe("sprinklerOn", "false");
grassMonitor.saveSamples = true;
grassMonitor.sample(1000000);
console.log(grassWet.probs()[0]);