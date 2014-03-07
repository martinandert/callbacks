'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function Around(nextCallback, userCallback, userConditions, chainConfig) {
  if (userConditions.length) {
    return function(env, done) {
      if (!env.halted && !env.error && all(userConditions, function(c) { return c(env.target); })) {
        userCallback(env, function() {
          nextCallback(env, done);
        }, done);
      } else if (env.error) {
        done(env);
      } else {
        nextCallback(env, done);
      }
    };
  } else {
    return function(env, done) {
      if (!env.halted && !env.error) {
        userCallback(env, function() {
          nextCallback(env, done);
        }, done);
      } else if (env.error) {
        done(env);
      } else {
        nextCallback(env, done);
      }
    };
  }
}

module.exports = Around;
