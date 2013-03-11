State Engines
=============

This package provides tools for simple state machines, such as those based on
Markov chains. The intent is to make it easier to tinker with state machines by
adding additional rules, shifting state definitions, pruning output, and so
forth.

Example of Use
--------------

Automatic generation of names is a thorny business, best avoided. But if you
wanted to try it out with state-engines, here is how it would work:

    var stateEngines = require("state-engines");

    // Some names to use as raw material in the state engine.
    var names = [
      "abbadon",
      "adriel",
      "ambriel",
      "arariel",
      ...
    ];

    // Create the state engine with a suitable converter and feed it the names.
    // This converter turns strings into a sequence of StringState instances of a
    // single letter each, and vice versa.
    var converter = new stateEngines.StringToStringStatesConverter();
    var engine = new stateEngines.MarkovChainStateEngine(converter, names);

    // Generate new names.
    for (var index = 0; index < 10; index++) {
      console.log(engine.generateEntity());
    }
