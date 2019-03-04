import {Network, SingleValue} from "./JsonManager";
import * as fs from "fs";

console.log("---");
console.log("Starting script");

//------------------
//Costruisco due oggetti leggendo e passando al costruttore il contenuto del file json
//Volendo è ovviamente possibile dargli direttamente la stringa del json nel costruttore
//------------------

//Costruisco la prima rete dal json bigNetwork.json
let Network1 = new Network(fs.readFileSync("./bigNetwork.json", 'utf8'));
//Faccio un test di observe e di sample
Network1.observe("n3", new SingleValue("True", "1"));
let samples = 1000;
let sample_promise = Network1.sample(samples);
sample_promise.then(function (result) {
    console.log("Sample result:" + result / samples);
});
//Costruisco la seconda rete dal json ourJson.json
let Network2 = new Network(fs.readFileSync("./ourJson.json", 'utf8'));
//Scrivo la stringa json generata in un file per visualizzarla meglio
//console.log("Network1.json:" + Network1.getNetworkJson());
//console.log("Network2.json:" + Network2.getNetworkJson());
fs.writeFileSync("OutputNetwork1.json", Network1.getNetworkJson());
fs.writeFileSync("OutputNetwork2.json", Network2.getNetworkJson());
console.log("Objects build done without errors");
console.log("---");

//Esempio di errore passando una stringa che non è un JSON
//let NetworkBroken = new Network("fake json content");