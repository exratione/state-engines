/**
 * @fileOverview
 * Class definition for a Markov chain state engine implementation.
 */

var util = require("util");
var StateEngine = require("../stateEngine");

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * A Markov chain implementation, inheriting from the StateEngine class.
 * 
 * Transition to a new state depends only on the current state; the new state
 * is picked at random from a weighted list. That list and the probability of
 * any given transition (e.g. A->C versus A->B) is established by providing a
 * set of example transition sequences.
 * 
 * This is useful for exercises such as creating random names that look similar
 * to a set of existing names, or creating nonsense texts that look somewhat
 * similar to existing texts. In general a Markov chain approach can only
 * produce good raw material, however, and the output will need further work to
 * be useful.
 * 
 * @param {Converter} converter
 *   A Converter instance, used to convert between entity and State
 *   representations of input and output to the state engine.
 * @param {array} entities
 *   An initial set of entities used to determine the rules for state
 *   transitions. More can be added later if desired.
*/
function MarkovChainStateEngine(converter, entities) {
  MarkovChainStateEngine.super_.call(this, converter);
  
  this.converter = converter;
  this.initializedForTransition = false;
  this.transitionCountTotals = {};
  this.transitions = {};
  this.transitionDefinitions = {};
  
  // Add whatever entities we've been provided.
  var self = this;
  if (entities) {
    entities.forEach(function(element) {
      self.addDefiningEntity(element);
    });
  }
}
util.inherits(MarkovChainStateEngine, StateEngine);
var p = MarkovChainStateEngine.prototype;

//-----------------------------------------------------------
// High-level methods
//-----------------------------------------------------------

/**
* Generate an entity built from a sequence of states according to the
* transition rules and coverter for this state engine.
* 
* @return {mixed}
*   An instance of the type of entity this state engine is intended to create.
*/
p.generateEntity = function() {
  // This just defaults to a converted state sequence, but there is
  // of course the opportunity for subclasses to apply rules here.
  return this.generateConvertedStateSequence();
};

//-----------------------------------------------------------
// Methods
//-----------------------------------------------------------

/**
 * Add a defining entity to those used by this Markov chain state engine to
 * define the rules by which state transitions occur. The type of entity
 * used here depends on the converter instance.
 * 
 * @param {mixed} entity
 *   An entity.
 */
p.addDefiningEntity = function(entity) {
  this.addDefiningStateSequence(this.converter.toStateRepresentation(entity));
};

/**
 * Add a sequence of states in the form of an array of state objects,
 * defining a path of transitions through the engine's states.
 * 
 * @param {Array} states
 *   An array containing a sequence of State objects.
 */
p.addDefiningStateSequence = function(states) {
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
 * the definition arrays that are used to pick weighted odds of
 * transition to a new state.
 */
p.initializeTransitionDefinitions = function() {
  var newTransitionDefinitions = {};
  var newTransitionCounts = {};
  
  // Build an array for each set of transition states, to be used
  // for a binary search when picking a new transition.
  for (stateKey in this.transitions) {
    newTransitionDefinitions[stateKey] = [];
    newTransitionCounts[stateKey] = 0;
    for (nextStateKey in this.transitions[stateKey]) {
      newTransitionDefinitions[stateKey].push({
        stateKey: nextStateKey,
        cumulativeCount: newTransitionCounts[stateKey]
      });
      newTransitionCounts[stateKey] += this.transitions[stateKey][nextStateKey];
    }
    
    // Sort the new array, smallest count to largest.
    newTransitionDefinitions[stateKey].sort(function(a, b) {
      return a.cumulativeCount - b.cumulativeCount;
    });
  }
  
  this.transitionDefinitions = newTransitionDefinitions;
  this.transitionCounts = newTransitionCounts;
  this.initializedForTransition = true;
};

/**
 * Return an array of State objects representing a sequence of transitions,
 * usually starting from an undefined state and ending at another undefined
 * state, but not including those in the array returned.
 * 
 * @return {array}
 *   An array of State objects.
 */
p.generateStateSequence = function() {
  var states = [];
  this.setCurrentStateToUndefined();
  this.transition();
  while (!this.currentState.isUndefined) {
    states.push(this.currentState);
    this.transition();
  }
  return states;
};

/**
 * Pass a sequence of state transitions through the converter and return the
 * result.
 * 
 * @return {array}
 *   An array of State objects.
 */
p.generateConvertedStateSequence = function() {
  return this.converter.fromStateRepresentation(this.generateStateSequence());
};

//-----------------------------------------------------------
// Inherited Methods
//-----------------------------------------------------------

p.transition = function() {
  // Initialize the data if needed.
  if (!this.initializedForTransition) {
    this.initializeTransitionDefinitions();
  }
  
  var key = this.currentState.key();
  var transitionDefinition = this.transitionDefinitions[key];
  var transitionCount = this.transitionCounts[key];
  
  // No transitions from this state? Then transition to the undefined state.
  if (!transitionDefinition || !transitionCount || !transitionDefinition.length) {
    this.currentState = this.undefinedState;
    return this.currentState;
  }
  
  // Pull out a random number and see where it falls in the cumulative counts
  // of the array for transition selections.
  var pick = Math.floor(transitionCount * Math.random());
  

  // Pseudo binary search, not looking for exact value, but where it falls on
  // or between two of the ordered cumulative counts.
  var low = 0;
  var high = transitionDefinition.length - 1;
  var index;
  var comparison;
  var comparator = function(a, b) {
    return a - b;
  };
  while (low <= high) {
    index = Math.floor((low + high) / 2);
    comparison = comparator(transitionDefinition[index].cumulativeCount, pick);
    
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
      && index + 1 <= transitionDefinition.length - 1 
      && pick > transitionDefinition[index + 1].cumulativeCount
    ) {
      low = index + 1; 
      continue;
    }
    
    // We're done, found it.
    break;
  }
      
  // Set the new state based on the index we ended up at.
  this.currentState = this.allowedStates[transitionDefinition[index].stateKey];
  return this.currentState;
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = MarkovChainStateEngine;