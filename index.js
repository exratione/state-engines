/**
 * @fileOverview
 * Convenience functions for creating new state engines and states.
 */

var MarkovChainStateEngine = require("./lib/stateEngines/markovChainStateEngine.js");
var StringState = require("./lib/states/stringState.js");

/**
 * @return {StateEngine}
 *   A new Markov chain based StateEngine instance.
 */
module.exports.markovChainStateEngine = function() {
  return new MarkovChainStateEngine();
};

/**
 * @return {State}
 *   A new State represented by a string.
 */
module.exports.stringState = function(str) {
  return new StringState(str);
};