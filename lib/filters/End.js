'use strict';

function End(env, cb) {
  if (!env.halted && env.fn) {
    env.fn.call(env.target, function(err, halt) {
      env.error   = err;
      env.halted  = halt;

      cb(env);
    });
  } else {
    cb(env);
  }
}

module.exports = End;
