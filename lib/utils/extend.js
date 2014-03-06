'use strict';

var hasProp = require('./hasProp');
var slice   = Array.prototype.slice;

function extendInto(left, right) {
  for (var key in right) {
    if (hasProp(right, key)) {
      left[key] = right[key];
    }
  }
}

function extend() {
  var objs    = slice.call(arguments);
  var result  = objs.shift();

  for (var i = 0, ii = objs.length; i < ii; i++) {
    extendInto(result, objs[i]);
  }

  return result;
}

module.exports = extend;
