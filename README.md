# 7DOS Proof Of Concept - Grafana plugin
## Requirements
* Grafana 5+

## Folder structure
* jsbayesLibrary contains external [jsBayes](https://github.com/vangj/jsbayes) library 
* ProofOfConcept
  - App_plugin
    - js-bayes-app-panel-base: initial structure of an app which contains a panel;
    - js-bayes-app-lettura-json: simple panel which displays JSON obtained from a string; 
  - Import_JSON_Panel: simple panel which displays an imported JSON file.
  - JSON: example of JSON file structure and building of a bayesian network. 