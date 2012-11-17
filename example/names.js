/**
 * @fileOverview
 * Use a Markov Chain state engine in a trivial way to build names.
 */

var stateEngines = require("state-engines");

/**
 * Assuming that the state engine is working with suitable StringStates, 
 * then use it to build a name.
 * 
 * @param {StateEngine} engine
 *   A state engine instance.
 * @return {string}
 *   A name.
 */
function generateName(engine) {
  var name = "";
  engine.setCurrentStateToUndefined();
  engine.transition();
  while (!engine.currentState.isUndefined) {
    name += engine.currentState.representation;
    engine.transition();
  }
  return name;
};

/**
 * A utility function for splitting a string into single-character states.
 * 
 * @param {string} string
 *   The string to convert.
 * @return {Array}
 *   An array of StringState objects.
 */
function stringToStringStateArray(str) {
  return str.split("").map(function(element) {
    return stateEngines.stringState(element);
  });
};

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

// Create the state engine and feed it the names.
var markovChainStateEngine = stateEngines.markovChainStateEngine();
names.forEach(function(element) {
  markovChainStateEngine.addPath(stringToStringStateArray(element));
});

// Generate new names.
for (var index = 0; index < 10; index++) {
  console.log(generateName(markovChainStateEngine));
}
