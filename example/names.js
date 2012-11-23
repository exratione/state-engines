/**
 * @fileOverview
 * Use a simple Markov chain state engine to build names.
 */

var stateEngines = require("state-engines");

// Some names to use as raw material in the state engine.
var names = [
  "abbadon",
  "adriel",
  "ambriel",
  "amesha spenta",
  "arariel",
  "ahriman",
  "ariel",
  "azazel",
  "azrael",
  "abymael",
  "barachiel",
  "cassiel",
  "camael",
  "dumah",
  "eremiel",
  "gabriel",
  "gadreel",
  "gagiel",
  "hadraniel",
  "haniel",
  "harut",
  "hesediel",
  "israfel",
  "jegudiel",
  "jehoel",
  "jequn",
  "jerahmeel",
  "jophiel",
  "kasdeja",
  "kiraman katibin",
  "kushiel",
  "kosmiel",
  "leliel",
  "lucifer",
  "maalik",
  "malik",
  "marut",
  "metatron",
  "michael",
  "munkar",
  "muriel",
  "nakir",
  "nuriel",
  "ophanim",
  "orifiel",
  "pahaliah",
  "penemue",
  "puriel",
  "qaphsiel",
  "raguel",
  "raphael",
  "raqib",
  "raziel",
  "remiel",
  "ridwan",
  "sachiel",
  "samael",
  "sandalphon",
  "sariel",
  "selaphiel",
  "seraphiel",
  "simiel",
  "shamsiel",
  "tzaphqiel",
  "temeluchus",
  "uriel",
  "uzziel",
  "yehudiel",
  "yerachmiel",
  "zabaniyah",
  "zachariel",
  "zadkiel",
  "zephon",
  "zophiel"
];

/**
 * A convenience function for the Markov chain name generation that will be
 * happening here.
 * 
 * @param {Converter} converter
 *   A converter implementation for switching between strings and state arrays.
 * @param {string} blurb
 *   Something to describe the output when it is logged.
 */
var generateNamesViaMarkovChain = function(converter, blurb) {
  // Create the state engine with a suitable converter and feed it the names.
  var engine = new stateEngines.MarkovChainStateEngine(converter, names);

  // Generate new names.
  console.log(blurb);
  for (var index = 1; index <= 10; index++) {
    console.log("" + index + ") " + engine.generateEntity());
  }
};

// Generate some names.
generateNamesViaMarkovChain(
  // This converter turns strings into a sequence of StringState instances of a 
  // single letter each, and vice versa.
  new stateEngines.StringToStringStatesConverter(),
  "Markov chain with single-letter states:"
);

// And some more names.
generateNamesViaMarkovChain(
   // Try it out with a different converter configuration: two-letter states this
   // time around.
  new stateEngines.StringToStringStatesConverter({
    length: 2
  }),
  "Markov chain with double-letter states:"
);

// And yet more names.
//And some more names.
generateNamesViaMarkovChain(
   // Try it out with a different converter configuration: two-letter states this
   // time around.
  new stateEngines.StringToStringStatesConverter({
    length: 1,
    lookbackLength: 1
  }),
  "Markov chain with single-letter states that look back by a single letter:"
);
