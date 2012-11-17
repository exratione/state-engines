/**
 * @fileOverview
 * A superclass for state engine state implementations.
 */

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * The superclass for state engine states.
 * 
 * @param representation
 *   A representation of the object state.
 */
function State(representation) {
 this.representation = representation;
}
var p = State.prototype;

//-----------------------------------------------------------
// Methods.
//-----------------------------------------------------------

/**
 * Compare this state with another.
 * 
 * @param {State} state 
 *   A State object.
 * @return {boolean}
 *   True if the provided state is the same as this one.
 */
p.isEqual = function(state) {
  return (this.key() === state.key());
};

//-----------------------------------------------------------
// Methods to be implemented by subclasses.
//-----------------------------------------------------------

/**
 * A unique string representation of this state - it cannot collide
 * with the string representation of any other state used in a given
 * engine.
 * 
 * @return {string}
 *   A unique string representation of this state.
 */
p.key = function() {
  throw new Exception("Not implemented");
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = State;