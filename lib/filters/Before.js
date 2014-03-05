'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function Before(nextCallback, userCallback, userConditions, chainConfig, filter) {
  var haltedFunc = chainConfig.terminator;

  if (hasProp(chainConfig, 'terminator') && userConditions.length) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();
      var halted = env.getHalted();

      if (!halted && all(userConditions, function(c) { return c.call(target, value); })) {
        var result = userCallback.call(target, value);

        env.setHalted(haltedFunc.call(target, result));

        if (env.getHalted()) {
          target._haltedCallbackHook(filter);
        }
      }

      return nextCallback.call(env);
    };
  } else if (hasProp(chainConfig, 'terminator')) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();
      var halted = env.getHalted();

      if (!halted) {
        var result = userCallback.call(target, value);

        env.setHalted(haltedFunc.call(target, result));

        if (env.getHalted()) {
          target._haltedCallbackHook(filter);
        }
      }

      return nextCallback.call(env);
    };
  } else if (userConditions.length) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();

      if (all(userConditions, function(c) { return c.call(target, value); })) {
        userCallback.call(target, value);
      }

      return nextCallback.call(env);
    };
  } else {
    return function(env) {
      userCallback.call(env.getTarget(), env.getValue());
      return nextCallback.call(env);
    };
  }
}

module.exports = Before;
