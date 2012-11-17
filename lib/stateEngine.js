/**
 * @fileOverview
 * A superclass for state engine implementations.
 */

var UndefinedState = require("./states/undefinedState");

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * The superclass for state engines.
 */
function StateEngine() {
  // A record of all states that this state engine can take on.
  this.allowedStates = {};
  
  // Set up the undefined state, and set it as the current state.
  this.undefinedState = new UndefinedState();
  this.allowedStates[this.undefinedState.key()] = this.undefinedState;
  this.currentState = this.undefinedState;
};
var p = StateEngine.prototype;

//-----------------------------------------------------------
// Methods
//-----------------------------------------------------------

/**
 * Add an allowed state to the engine.
 * 
 * @param {State} state
 *   A State object.
 */
p.addAllowedState = function(state) {
  var key = state.key();
  if (!this.allowedStates[key]) {
    this.allowedStates[state.key()] = state;
  }
};

/**
 * Set the current state of the engine.
 * 
 * @param {State} state
 *   A State object.
 */
p.setCurrentState = function(state) {
  if (this.allowedStates[state.key()]) {
    this.currentState = state;
  } else {
    this.currentState = undefined;
  }
};

/**
 * Set the current state of the engine to an undefined state.
 */
p.setCurrentStateToUndefined = function() {
  this.currentState = this.undefinedState;
};

//-----------------------------------------------------------
// Methods to be implemented by subclasses.
//-----------------------------------------------------------

/**
 * Move the state machine to its next state according to whatever rules
 * the engine follows for determining transitions.
 * 
 * @return {State|UndefinedState}
 *   A State object representing the new current state, or undefined if the
 *   state engine halts at the present current state.
 */
p.transition = function() {
  throw new Exception("Not implemented");
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = StateEngine;