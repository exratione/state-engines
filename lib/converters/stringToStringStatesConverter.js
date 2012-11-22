/**
 * @fileOverview
 * A converter class for switching between a string object and an array of
 * StringState instances, each of which is a substring of the original string.
 */

var util = require("util");
var Converter = require("../converter");
var StringState = require("../states/stringState");

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * A converter class for switching between a string object and an array of
 * StringState instances, each of which is a substring of the original string.
 * e.g. "name" <=> "n", "a", "m", "e".
 * 
 * The configuration parameters for this class are as follows:
 * 
 * config = {
 *   length: number of characters in a StringState substring.
 * }
 * 
 * @param {Object} config
 *   Configuration parameters.
 */
function StringToStringStatesConverter(config) {
  StringToStringStatesConverter.super_.call(this, config);
  
  // Check the configuration for the length of the strings in the StringState
  // instances created when converting a string entity.
  if (!this.config.length || typeof this.config.length != "number") {
    this.config.length = 1;
  }
}
util.inherits(StringToStringStatesConverter, Converter);
var p = StringToStringStatesConverter.prototype;

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
  // Split it up into substrings of the given length, where the last might be
  // smaller, and make StringStates of them.
  var states = [];
  for (var index = 0; index < entity.length; index += this.config.length) {
    states.push(new StringState(entity.substr(index, this.config.length)));
  }
  return states;
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

module.exports = StringToStringStatesConverter;