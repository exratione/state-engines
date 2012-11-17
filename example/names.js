/**
 * @fileOverview
 * Use a Markov Chain state engine in a trivial way to build names.
 */

var stateEngines = require("state-engines");

/**
 * Assuming that the state engine is working with StringStates, then
 * use it to build a name.
 * 
 * @return {string}
 *   A name.
 */
function generateName(stateEngine) {
  var name = "";
  stateEngine.setCurrentStateToUndefined();
  stateEngine.transition();
  while (!stateEngine.currentState.isUndefined) {
    name += stateEngine.currentState.representation;
    stateEngine.transition();
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
  var array = str.split("");
  for (var index = 0; index < array.length; index++) {
    array[index] = stateEngines.stringState(array[index]);
  }
  return array;
};

// Some names to use as raw material in the state engine.
var names = [
  "Abbadon",
  "Adriel",
  "Ambriel",
  "Amesha Spenta",
  "Arariel",
  "Ahriman",
  "Ariel",
  "Azazel",
  "Azrael",
  "Abymael",
  "Barachiel",
  "Cassiel",
  "Camael",
  "Darda'il",
  "Dumah",
  "Eremiel",
  "Gabriel",
  "Gadreel",
  "Gagiel",
  "Hadraniel",
  "Haniel",
  "Harut",
  "Hesediel",
  "Hamalat al-Arsh",
  "Israfel",
  "Jegudiel",
  "Jehoel",
  "Jequn",
  "Jerahmeel",
  "Jophiel",
  "Kasdeja",
  "Kiraman Katibin",
  "Kushiel",
  "Kosmiel",
  "Leliel",
  "Lucifer",
  "Maalik",
  "Malik",
  "Marut",
  "Metatron",
  "Michael",
  "Munkar",
  "Mu'aqqibat",
  "Muriel",
  "Nakir",
  "Nuriel",
  "Ophanim",
  "Orifiel",
  "Pahaliah",
  "Penemue",
  "Puriel",
  "Qaphsiel",
  "Raguel",
  "Raphael",
  "Raqib",
  "Raziel",
  "Remiel",
  "Ridwan",
  "Sachiel",
  "Samael",
  "Sandalphon",
  "Sariel",
  "Selaphiel",
  "Seraphiel",
  "Simiel",
  "Shamsiel",
  "Tzaphqiel",
  "Temeluchus",
  "Uriel",
  "Uzziel",
  "Yehudiel",
  "Yerachmiel",
  "Zabaniyah",
  "Zachariel",
  "Zadkiel",
  "Zephon",
  "Zophiel"
];

// Create the state engine and feed it the names.
var markovChainStateEngine = stateEngines.markovChainStateEngine();
for (var index = 0; index < names.length; index++) {
  markovChainStateEngine.addPath(stringToStringStateArray(names[index]));
}

// Generate new names.
for (var index = 0; index < 10; index++) {
  console.log(generateName(markovChainStateEngine));
}
