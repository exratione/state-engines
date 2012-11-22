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

// Create the state engine with a suitable converter and feed it the names.
// This converter turns strings into a sequence of States instances of a 
// single letter each, and vice versa.
var converter = new stateEngines.StringToLetterStatesConverter();
var engine = new stateEngines.MarkovChainStateEngine(converter, names);

// Generate new names.
for (var index = 0; index < 10; index++) {
  console.log(engine.generateEntity());
}
