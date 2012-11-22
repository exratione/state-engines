/**
 * @fileOverview
 * A converter class for switching between string objects and arrays of
 * single-letter StringState instances, both representing the same
 * string.
 */

var util = require("util");
var Converter = require("../converter");
var StringState = require("../states/stringState");

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * A converter class for converting between strings and arrays of
 * single-letter string states.
 */
function StringToLetterStatesConverter() {
  StringToLetterStatesConverter.super_.call(this);
}
util.inherits(StringToLetterStatesConverter, Converter);
var p = StringToLetterStatesConverter.prototype;

//-----------------------------------------------------------
// Inherited Methods
//-----------------------------------------------------------

/**
 * Given a string convert it to an array of State objects each of which
 * represents a single letter.
 * 
 * @param {string} entity
 *   The string to be mapped to letter states.
 * @return {array}
 *   An array of single-letter StringState objects.
 */
p.toStateRepresentation = function(entity) {
  // Make sure I'm dealing with a string.
  if (typeof entity != "string") {
    throw new Exception("Provided entity must be a string.");
  }
  return entity.split("").map(function(element, index, array) {
    return new StringState(element);
  });
};

/**
 * Given an array of StringStates, reduce it to a single string.
 * 
 * @param {array} states
 *   An array of StringState objects.
 * @return {string}
 *   A string formed by combining the states.
 */
p.fromStateRepresentation = function(states) {
  var entity = states.map(function(element, index, array) {
    return element.representation;
  });
  return entity.join("");
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = StringToLetterStatesConverter;