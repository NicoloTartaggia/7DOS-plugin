import * as jsbayes from "../../jsbayesLibrary/jsbayes";

// ---
// Json file import
// ---
//import small_json from "./ourJson.json";
import big_network from "./bigNetwork.json";

console.log("Starting script");
console.log("---");

// ---
// Script di test lettura da Json
// ---

let g = jsbayes.newGraph();
console.log("newGraph done");

let nodes_hashmap = {};
let samples_number = 1000000;
let json_file = <any>big_network;

//Creazione nodi leggendo i nomi dal json
for(let i=0; i < (json_file).nodes.length; i++){
    let name = (json_file).nodes[i].name;
    nodes_hashmap[name] = g.addNode(name, (json_file).nodes[i].values);
}

//Associazione parenti dei nodi
for(let i=0; i < (json_file).nodes.length; i++){
    let name = (json_file).nodes[i].name;
    //Per ogni nodo leggo la sua lista di parenti
    for(let k=0; k < (json_file).nodes[i].parents.length; k++){
        let ParentName = (json_file).nodes[i].parents[k];
        nodes_hashmap[name].addParent(nodes_hashmap[ParentName])
    }
}

//Lettura tabelle cpt
for(let i=0; i < (json_file).nodes.length; i++) {
    let name = (json_file).nodes[i].name;
    nodes_hashmap[name].cpt = (json_file).nodes[i].cpt;
}

g.observe("n3", "1");
g.sample(samples_number).then(function(result) {
    console.log("Json result:" + result / samples_number);
});

console.log("Json sample called - " + samples_number);

// ---
// Test rete fatta a mano
// ---

let g2 = jsbayes.newGraph();
let n1 = g2.addNode('n1', ['0', '1']);
let n2 = g2.addNode('n2', ['0', '1']);
let n3 = g2.addNode('n3', ['0', '1']);

n3.addParent(n1);
n3.addParent(n2);

n1.cpt = [0.2, 0.8]; //[ P(n1=0), P(n1=1) ]
n2.cpt = [0.8, 0.2]; //[ P(n2=0), P(n2=1) ]
n3.cpt = [
    [ [ 0.2, 0.8 ], [ 0.8, 0.2 ] ],
    [ [ 0.2, 0.8 ], [ 0.8, 0.2 ] ]
];

g2.observe("n3", "1");
g2.sample(samples_number).then(function (result) {
    console.log("Manual result:" +result / samples_number);
});

console.log("Manual sample called - " + samples_number);
