'use strict';

function End(env) {
  var fn = env.getRunFunc();
  env.setValue(!env.getHalted() && (!fn || fn.call(env.getTarget())));
  return env;
}

module.exports = End;
