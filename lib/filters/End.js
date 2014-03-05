'use strict';

function End(env) {
  var fn = env.getRunFunc();
  env.value = !env.isHalted() && (!fn || fn.call(null));
  return env;
}

module.exports = End;
