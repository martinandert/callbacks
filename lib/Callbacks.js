'use strict';

var Type  = require('./Type.js');
var Mixer = require('./Mixer.js');

var Callbacks = {
  Type: Type,
  mixInto: Mixer.mixInto
};

module.exports = Callbacks;
