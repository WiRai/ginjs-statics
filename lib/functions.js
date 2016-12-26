'use strict';

var path = require('path');

var functions = {};

module.exports = functions;

/**
 * @function refine_getContextTemplate
 * @description Refines getContextTemplate to add a STATIC_DIR key.
 * @param {Function} original - Old implementation.
 * @returns {void} Void.
 */
functions.refine_getContextTemplate = function (original) {
  return function () {
    if (!process.env.PRODUCT_DIR) {
      throw new Error('PRODUCT_DIR not set.');
    }
    var context = require('ginjs').context; // eslint-disable-line global-require
    var contextTemplate = original();
    contextTemplate.STATIC_DIR = path.join(context.DATA_DIR || contextTemplate.DATA_DIR, 'statics');
    return contextTemplate;
  };
};