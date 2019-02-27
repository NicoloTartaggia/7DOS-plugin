import {Network, SingleValue} from "./JsonTestScript";

console.log("---");
console.log("Starting script");
//First object build
let Network1 = new Network("./bigNetwork.json");
//Observe test
Network1.observe("n3", new SingleValue("True", "1"));
let samples = 1000;
let sample_promise = Network1.sample(samples);
sample_promise.then(function (result) {
    console.log("Sample result:" + result / samples);
});
//Build another object
let Network2 = new Network("./ourJson.json");
console.log("Objects build done without errors");
console.log("---");