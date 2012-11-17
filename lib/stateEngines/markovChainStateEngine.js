/**
 * @fileOverview
 * A Markov Chain state engine. Transition to a new state depends only on the
 * current state; the new state is picked at random from a weighted list. That
 * list and the probability of any given transition (e.g. A->C versus A->B) is
 * established by parsing a set of example transition paths.
 * 
 * This is useful for exercises like creating random names that look similar to
 * a set of existing names, or creating nonsense texts that look somewhat
 * similar to existing texts. In general a Markov Chain approach can only
 * produce good raw material, however, and the output will need furth work to
 * be useful.
 */

var util = require("util");
var StateEngine = require("../stateEngine");

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
* @class
* A Markov Chain state engine.
*/
function MarkovChainStateEngine() {
  MarkovChainStateEngine.super_.call(this);
  
  this.initializedForTransition = false;
  this.transitionCountTotals = {};
  this.transitions = {};
  this.transitionSelections = {};
}
util.inherits(MarkovChainStateEngine, StateEngine);
var p = MarkovChainStateEngine.prototype;

//-----------------------------------------------------------
// Methods
//-----------------------------------------------------------

/**
 * Add a set of transitions in the form of an array of
 * state objects, defining a path through the engine's states.
 * 
 * @param {Array} states
 *   An array containing a sequence of State objects.
 */
p.addPath = function(states) {
  // If this is an empty array, skip
  if (!states.length) {
    return;
  }
  
  // Prefix the list of states with the undefined state if we have to.
  // We do this to allow weighted transitions into the first in a chain
  // of states - e.g. first word in a sentence, first letter in a name.
  if (!states[0].isUndefined) {
    states.unshift(this.undefinedState);
  }
  
  for (var index = 0; index < states.length; index++) {
    var state = states[index];
    var stateKey = state.key();
    // Keep a note of this possible state if we don't have it already.
    this.addAllowedState(state);
    // Ensure that this state has a transitions object.
    if (!this.transitions[stateKey]) {
      this.transitions[stateKey] = {};
    }
    
    if (index == states.length - 1) {
      // This is the end, so it goes to undefined.
      var nextStateKey = this.undefinedState.key();
    } else {
      // Look ahead to the next state, and amend the transitions.
      var nextState = states[index + 1];
      var nextStateKey = nextState.key();
    }
    
    if (!this.transitions[stateKey][nextStateKey]) {
      this.transitions[stateKey][nextStateKey] = 1;
    } else {
      this.transitions[stateKey][nextStateKey]++;
    }
  }

  // Note that initialization needs to be redone.
  this.initializedForTransition = false;
};

/**
 * Run through the various transition paths provided and build
 * the selection arrays that are used to pick from the weighted
 * odds of transition to a new state.
 */
p.initialize = function() {
  var newTransitionSelections = {};
  var newTransitionCounts = {};
  
  // Build an array for each set of transition states, to be used
  // for a binary search when picking a new transition.
  for (stateKey in this.transitions) {
    newTransitionSelections[stateKey] = [];
    newTransitionCounts[stateKey] = 0;
    for (nextStateKey in this.transitions[stateKey]) {
      newTransitionSelections[stateKey].push({
        stateKey: nextStateKey,
        cumulativeCount: newTransitionCounts[stateKey]
      });
      newTransitionCounts[stateKey] += this.transitions[stateKey][nextStateKey];
    }
    
    // Sort the new array, smallest count to largest.
    newTransitionSelections[stateKey].sort(function(a, b) {
      return a.cumulativeCount - b.cumulativeCount;
    });
  }
  
  this.transitionSelections = newTransitionSelections;
  this.transitionCounts = newTransitionCounts;
  this.initializedForTransition = true;
};


p.transition = function() {
  // Initialize the data if needed.
  if (!this.initializedForTransition) {
    this.initialize();
  }
  
  var key = this.currentState.key();
  var transitionSelection = this.transitionSelections[key];
  var transitionCount = this.transitionCounts[key];
  
  // No transitions from this state? Then transition to the undefined state.
  if (!transitionSelection || !transitionCount || !transitionSelection.length) {
    this.currentState = this.undefinedState;
    return this.currentState;
  }
  
  // Pull out a random number and see where it falls in the cumulative counts
  // of the array for transition selections.
  var pick = Math.floor(transitionCount * Math.random());
  

  // Pseudo binary search, not looking for exact value, but where it falls on
  // or between two of the ordered cumulative counts.
  var low = 0;
  var high = transitionSelection.length - 1;
  var index;
  var comparison;
  var comparator = function(a, b) {
    return a - b;
  };
  while (low <= high) {
    index = Math.floor((low + high) / 2);
    comparison = comparator(transitionSelection[index].cumulativeCount, pick);
    
    // Pick is smaller than this cumulativeCount, so look further towards the
    // start of the array.
    if (comparison > 0) { 
      high = index - 1;
      continue;
    }
    
    // Pick is larger than this cumulativeCount. If pick is smaller than the
    // next cumulativeCount, then we're good. Otherwise look further towards
    // the end of the array.
    if (
      comparison < 0 
      && index + 1 <= transitionSelection.length - 1 
      && pick > transitionSelection[index + 1].cumulativeCount
    ) {
      low = index + 1; 
      continue;
    }
    
    // We're done, found it.
    break;
  }
      
  // Set the new state based on the index we ended up at.
  this.currentState = this.allowedStates[transitionSelection[index].stateKey];
  return this.currentState;
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = MarkovChainStateEngine;