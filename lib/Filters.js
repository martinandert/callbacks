'use strict';

var Before      = require('./filters/Before.js');
var After       = require('./filters/After.js');
var Around      = require('./filters/Around.js');
var End         = require('./filters/End.js');

var Filters = {
  Before: Before,
  After:  After,
  Around: Around,
  End:    End
};

module.exports = Filters;
