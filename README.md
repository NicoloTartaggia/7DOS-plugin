[![Build Status](https://travis-ci.org/NicoloTartaggia/7DOS-plugin.svg?branch=master)](https://travis-ci.org/NicoloTartaggia/7DOS-plugin)
[![Coverage Status](https://coveralls.io/repos/github/NicoloTartaggia/7DOS-plugin/badge.svg?branch=master)](https://coveralls.io/github/NicoloTartaggia/7DOS-plugin?branch=master)

# 7DOS Grafana Plugin

A Bayesian network is a probabilistic graphical model 
(a type of statistical model) that represents a set of 
variables and their conditional dependencies via a 
directed acyclic graph (DAG). Bayesian networks are ideal
for taking an event that occurred and predicting the 
likelihood that any one of several possible known causes
was the contributing factor.

More details in [Wikipedia.](https://en.wikipedia.org/wiki/Bayesian_network)

## The plugin
Our plugin gets flows of information from one or more 
inputs and can perform a probabilistic inference through 
several steps:
1. Read a Bayesian network definition from a .json file
2. Set a data source which stores data flows
3. Associate flows to network's nodes 
4. Perform probabilistic inference
6. Write results in a database. In our case InfluxDB is 
the default one   
5. Display the results with Grafana default panel 
(Graph, Singlestat, etc)

## How to Build

```
npm install
npm run build
```

## Development team
We are Computer Science students at [University of Padua](https://www.unipd.it/). 
The plugin have been developed for Software Engineering 
course.


7DOS is composed of seven members:
- [Nicolò Tartaggia](https://github.com/NicoloTartaggia)
- [Andrea Trevisin](https://github.com/knowbot)
- [Michele Roverato](https://github.com/ScrappyCocco)
- [Giacomo Barzon](https://github.com/Giacomobarzon97)
- [Marco Costantino](https://github.com/UdrK)
- [Lorenzo Busin](https://github.com/lorenzobusin)
- [Giovanni Sorice](https://github.com/GiovanniSorice)
