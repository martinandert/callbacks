'use strict';

function include(arr, elem) {
  for (var i = 0, ii = arr.length; i < ii; i++) {
    if (arr[i] === elem) {
      return true;
    }
  }

  return false;
}

module.exports = include;
