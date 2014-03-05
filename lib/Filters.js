'use strict';

var Environment = require('./filters/Environment.js');
var End         = require('./filters/End.js');
var Before      = require('./filters/Before.js');
var After       = require('./filters/After.js');
var Around      = require('./filters/Around.js');

var Filters = {
  Environment: Environment,
  End: End,
  Before: Before,
  After: After,
  Around: Around
};

module.exports = Filters;
