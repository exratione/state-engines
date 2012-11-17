/**
 * @fileOverview
 * An undefined state - the special case where a state engine is not
 * initialized, or where a flow of transitions comes to an end.
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
function UndefinedState() {
  UndefinedState.super_.call(this);
  this.isUndefined = true;
}
util.inherits(UndefinedState, State);
var p = UndefinedState.prototype;

//-----------------------------------------------------------
// Methods
//-----------------------------------------------------------

p.key = function() {
  return "";
};

//-----------------------------------------------------------
// Exports - Class constructor
//-----------------------------------------------------------

module.exports = UndefinedState;