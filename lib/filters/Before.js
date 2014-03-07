'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function Before(nextCallback, userCallback, userConditions, chainConfig, filter) {
  var haltedFunc = chainConfig.terminator;

  if (userConditions.length) {
    return function(env, done) {
      if (!env.halted && !env.error && all(userConditions, function(c) { return c(env.target, env.result); })) {
        userCallback(env, function(env) {
          if (env.halted) {
            env.target._haltedCallbackHook(filter);
          }

          if (env.error) {
            done(env);
          } else {
            nextCallback(env, done);
          }
        });
      } else if (env.error) {
        done(env);
      } else {
        nextCallback(env, done);
      }
    };
  } else {
    return function(env, done) {
      if (!env.halted && !env.error) {
        userCallback(env, function(env) {
          if (env.halted) {
            env.target._haltedCallbackHook(filter);
          }

          if (env.error) {
            done(env);
          } else {
            nextCallback(env, done);
          }
        });
      } else if (env.error) {
        done(env);
      } else {
        nextCallback(env, done);
      }
    };
  }
}

module.exports = Before;
