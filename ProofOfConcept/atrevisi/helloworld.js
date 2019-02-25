"use strict";
exports.__esModule = true;
require("../../jsbayesLibrary");
var jsbayes = require("../../jsbayesLibrary/jsbayes");
//setting up a mock bayesian network
var grassMonitor = jsbayes.newGraph();
var isRaining = grassMonitor.addNode("isRaining", ["true", "false"]);
var sprinklerOn = grassMonitor.addNode("sprinklerOn", ["true", "false"]);
var grassWet = grassMonitor.addNode("grassWet", ["true", "false"]);
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
grassMonitor.saveSamples = true;
grassMonitor.sample(1000000);
console.log(grassWet.probs()[0]);
