import * as jsbayes from "../../jsbayesLibrary/jsbayes";
import * as fs from "fs";

// ---
// Script di test lettura da Json
// ---

//-----------------------------------------
//-----------------------------------------
//-----------------------------------------
// Wrapper di test per i tipi di valori dei nodi nel json

class NodeValue {
    private readonly name: string;

    constructor(input_name: string) {
        this.name = input_name;
    }

    getName() {
        return this.name;
    }
}

class SingleValue extends NodeValue {
    private readonly value: string;

    constructor(input_name: string, input_value: string) {
        super(input_name);
        this.value = input_value
    }

    getValue() {
        return this.value;
    }
}

class RangeValue extends NodeValue {
    private readonly rangeMin: number;
    private readonly rangeMax: number;

    constructor(input_name: string, input_rangeMin: number, input_rangeMax: number) {
        super(input_name);
        this.rangeMin = input_rangeMin;
        this.rangeMax = input_rangeMax;
    }

    getRangeMin() {
        return this.rangeMin;
    }

    getRangeMax() {
        return this.rangeMax;
    }
}

//-----------------------------------------
//-----------------------------------------
//-----------------------------------------
// Wrapper di test per la rete Bayesiana

class Network_Node {
    private readonly name: string;
    private values: NodeValue[];
    private cpt: Array<Array<number>>;

    public constructor(input_name: string, input_values: NodeValue[], input_cpt: Array<Array<number>>) {
        this.name = input_name;
        this.values = input_values;
        this.cpt = input_cpt;
    }

    public getStringValues() {
        let returnString: string[] = [];
        for (let i = 0; i < this.values.length; i++) {
            returnString.push(this.values[i].getName());
        }
        return returnString;
    }

    public setCpt(input_cpt: Array<Array<number>>) {
        this.cpt = input_cpt;
    }

    public getCpt() {
        return this.cpt;
    }
}

class Network {
    private readonly network: jsbayes;
    private node_objects_dictionary: { [name: string]: Network_Node; } = {};
    private node_dictionary: {} = {};

    public constructor(json_filename: string = null) {
        this.network = jsbayes.newGraph();

        if (json_filename != null) {
            this.buildNetworkFromJson(json_filename);
        }
    }

    private checkIfNodeExist(node_name: string) {
        return node_name in this.node_objects_dictionary;
    }

    public addNode(input_name: string, input_values: NodeValue[], input_cpt: Array<Array<number>>) {
        let node = new Network_Node(input_name, input_values, input_cpt);
        this.node_dictionary[input_name] = this.network.addNode(input_name, node.getStringValues());
        this.node_objects_dictionary[input_name] = node;
        if (input_cpt.length > 0) {
            this.setNodeCpt(input_name, input_cpt);
        }
    }

    public removeNode(input_name: string) {
        //TODO
    }

    public createLink(node_name: string, node_parent_name: string) {
        if (this.checkIfNodeExist(node_name)) {
            if (this.checkIfNodeExist(node_parent_name)) {
                this.node_dictionary[node_name].addParent(this.node_dictionary[node_parent_name])
            } else {
                throw new Error("The node called " + node_parent_name + " can't be found!");
            }
        } else {
            throw new Error("The node called " + node_name + " can't be found!");
        }
    }

    public removeLink(node_name: string, node_parent_name: string) {
        //TODO
    }

    public observe(node_name: string, value: NodeValue) {
        if (this.checkIfNodeExist(node_name)) {
            if (this.node_objects_dictionary[node_name].getStringValues().includes(value.getName())) {
                this.network.observe(node_name, value.getName());
            } else {
                throw new Error("The value is not valid for this node!");
            }
        } else {
            throw new Error("The node called " + node_name + " can't be found!");
        }
    }

    public unobserve(node_name: string) {
        if (this.checkIfNodeExist(node_name)) {
            this.network.unobserve(node_name);
        } else {
            throw new Error("The node called " + node_name + " can't be found!");
        }
    }

    public setNodeCpt(node_name: string, input_cpt: Array<Array<number>>) {
        if (this.checkIfNodeExist(node_name)) {
            this.node_objects_dictionary[node_name].setCpt(input_cpt);
            if (input_cpt.length == 1) {
                this.node_dictionary[node_name].setCpt(input_cpt[0]);
            } else {
                this.node_dictionary[node_name].setCpt(input_cpt);
            }
        } else {
            throw new Error("The node called " + node_name + " can't be found!");
        }
    }

    public sample(samples: number) {
        return this.network.sample(samples);
    }

    private buildNetworkFromJson(json_filename: string) {
        if (!fs.existsSync(json_filename)) {
            throw new Error("The file:" + json_filename + " can't be found!");
        }
        let json_file = JSON.parse(fs.readFileSync(json_filename, 'utf8'));

        //Creazione nodi leggendo i nomi dal json e delle relative cpt
        for (let i = 0; i < (json_file).nodes.length; i++) {
            let name = (json_file).nodes[i].name;

            //Per ogni nodo leggo la sua lista di possibili valori
            let obj_values: NodeValue[] = [];
            for (let k = 0; k < (json_file).nodes[i].values.length; k++) {
                let current_value = (json_file).nodes[i].values[k];
                if (current_value.type === "single") {
                    obj_values.push(new SingleValue(current_value.name, current_value.value));
                } else if (current_value.type === "range") {
                    obj_values.push(new RangeValue(current_value.name, current_value.rangeMin, current_value.rangeMax));
                }
            }

            this.addNode(name, obj_values, []);
        }

        //Per ogni nodo leggo la sua lista di parenti
        for (let i = 0; i < (json_file).nodes.length; i++) {
            let name = (json_file).nodes[i].name;
            for (let k = 0; k < (json_file).nodes[i].parents.length; k++) {
                let ParentName = (json_file).nodes[i].parents[k];
                this.createLink(name, ParentName);
            }
        }

        //Associazione parenti dei nodi
        for (let i = 0; i < (json_file).nodes.length; i++) {
            let name = (json_file).nodes[i].name;
            this.setNodeCpt(name, (json_file).nodes[i].cpt);
        }

    }//end_buildNetworkFromJson
}

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

