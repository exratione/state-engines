/**
 * @fileOverview
 * A converter class for switching between a string object and an array of
 * StringState instances, each of which is a substring of the original string.
 * These substrings can be set to overlap to some degree.
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
 * These substrings can be set to overlap to some degree. e.g in the case of
 * single letter substrings with a single letter of overlap:
 *
 * "name" <=> "n", "na", "am", "me"
 *
 * Or for single letter substrings with no overlap:
 *
 * "name" <=> "n", "a", "m", "e"
 *
 * The configuration parameters for this class are as follows:
 *
 * config = {
 *   length: number of non-overlapped characters in a substring,
 *   lookbackLength: number of prior characters to include in each state
 * }
 *
 * @param {Object} config
 *   Configuration parameters.
 */
function StringToStringStatesConverter(config) {
  StringToStringStatesConverter.super_.call(this, config);

  // Check the configuration.
  if (!this.config.length || typeof this.config.length !== "number") {
    this.config.length = 1;
  }
  if (!this.config.lookbackLength || typeof this.config.lookbackLength !== "number") {
    this.config.lookbackLength = 0;
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
  if (typeof entity !== "string") {
    throw new Error("Provided entity must be a string.");
  }
  // Split it up into substrings of the given length, where the last might be
  // smaller, and make StringStates of them.
  var states = [];
  var substring, substringIndex, substringLength;
  for (var index = 0; index < entity.length; index += this.config.length) {
    // The start of the non-overlapping part is at index, so figure out where
    // to start the overlapping part. At the start of the string, the
    // substrings don't have anything to look back to, so are shorter.
    substringIndex = Math.max(0, index - this.config.lookbackLength);
    substringLength = this.config.length + Math.min(this.config.lookbackLength, index);
    substring = entity.substr(substringIndex, substringLength);
    states.push(new StringState(substring));
  }

  return states;
};

/**
 * Given an array of StringStates, reduce it to a single string.
 *
 * @param {array} states
 *   An array of StringState objects.
 * @return {string}
 *   A string formed by combining the non-overlapping parts of the StringState
 *   substrings.
 */
p.fromStateRepresentation = function(states) {
  var self = this;
  var entity = states.map(function(element, index, array) {
    // Take the final this.config.length characters from each StringState,
    // as these are the ones that don't overlap.
    return element.representation.substr(0 - self.config.length);
  });
  return entity.join("");
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = StringToStringStatesConverter;
