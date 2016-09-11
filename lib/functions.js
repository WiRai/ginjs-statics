'use strict';

var functions = {};

module.exports = functions;

functions.refine_getContextTemplate = function (original) {
  return function () {
    var context = original();
    context.STATIC_DIR = '';
    return context;
  };
};