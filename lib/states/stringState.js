/**
 * @fileOverview
 * Class definition for a state that is a string.
 */

var util = require("util");
var State = require("../state");

//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/**
 * @class
 * A state that is a string.
 *
 * @param {String} representation
 *   A string.
 */
function StringState(representation) {
  StringState.super_.call(this, representation);
}
util.inherits(StringState, State);
var p = StringState.prototype;

//-----------------------------------------------------------
// Methods
//-----------------------------------------------------------

p.key = function() {
  return this.representation;
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = StringState;
