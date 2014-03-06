'use strict';

var Type = {
  BEFORE: 'before',
  AFTER:  'after',
  AROUND: 'around'
};

Type._ALL = [Type.BEFORE, Type.AFTER, Type.AROUND];

module.exports = Type;
