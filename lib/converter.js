/**
 * @fileOverview
 * Superclass definition for converter implementations.
 */

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * The superclass for converter definitions.
 *
 * Converters are utility classes that define a way to convert between an
 * entity and a sequence of State objects, both of which are different
 * representations of the same thing. The sequence of State objects represents
 * a path of transitions through a state machine.
 *
 * A converter is generally use to translate input and output from a Markov
 * chain based state machine. A trivial example is to convert a string to a
 * sequence of single letter StringState instances, and vice versa.
 *
 * @param {Object} config
 *   Configuration parameters.
 */
function Converter(config) {
  if (typeof config === "object") {
    this.config = config;
  } else {
    this.config = {};
  }
}
var p = Converter.prototype;

//-----------------------------------------------------------
// Methods to be implemented by subclasses.
//-----------------------------------------------------------

/**
 * Given an entity, convert it to an array of State objects representing
 * a path of transitions through a state machine.
 *
 * @param {mixed} entity
 *   The entity to be mapped to states.
 * @return {array}
 *   An array of State objects.
 */
p.toStateRepresentation = function(entity) {
  throw new Error("Not implemented");
};

/**
 * Given an array of State instances, representing a path of transitions
 * through a state machine, convert it to an equivalent entity representation.
 *
 * @param {array} states
 *   An array of State objects.
 * @return {mixed}
 *   An entity of some sort.
 */
p.fromStateRepresenation = function(states) {
  throw new Error("Not implemented");
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = Converter;
