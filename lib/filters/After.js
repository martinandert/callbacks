'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function After(nextCallback, userCallback, userConditions, chainConfig) {
  if (chainConfig.skipAfterCallbacksIfTerminated === true) {
    if (hasProp(chainConfig, 'terminator') && userConditions.length) {
      return function(env, done) {
        nextCallback(env, function(env) {
          if (!env.halted && !env.error && all(userConditions, function(c) { return c(env.target); })) {
            userCallback(env, done);
          } else {
            done(env);
          }
        });
      };
    } else if (hasProp(chainConfig, 'terminator')) {
      return function(env, done) {
        nextCallback(env, function(env) {
          if (!env.halted && !env.error) {
            userCallback(env, done);
          } else {
            done(env);
          }
        });
      };
    } else if (userConditions.length) {
      return function(env, done) {
        nextCallback(env, function(env) {
          if (!env.error && all(userConditions, function(c) { return c(env.target); })) {
            userCallback(env, done);
          } else {
            done(env);
          }
        });
      };
    } else {
      return function(env, done) {
        nextCallback(env, function(env) {
          userCallback(env, done);
        });
      };
    }
  } else {
    if (userConditions.length) {
      return function(env, done) {
        nextCallback(env, function(env) {
          if (!env.error && all(userConditions, function(c) { return c(target, value); })) {
            userCallback(env, done);
          } else {
            done(env);
          }
        });
      };
    } else {
      return function(env, done) {
        nextCallback(env, function(env) {
          userCallback(env, done);
        });
      };
    }
  }
}

module.exports = After;
