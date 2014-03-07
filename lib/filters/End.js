'use strict';

function End(env, cb) {
  if (!env.halted && env.fn) {
    env.fn.call(env.target, function(err, result) {
      env.error = err;

      if (typeof result !== 'undefined') {
        env.result = result;
      }

      cb(env);
    });
  } else {
    cb(env);
  }
}

module.exports = End;
