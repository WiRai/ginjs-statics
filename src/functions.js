/* @flow */
const path = require('path');

const functions = {};

module.exports = functions;

/**
 * @function refine_getContextTemplate
 * @description Refines getContextTemplate to add a STATIC_DIR key.
 * @param {Function} original - Old implementation.
 * @returns {void} Void.
 */
functions.refine_getContextTemplate = (original: Function): Function => (): Object => {
  if (!process.env.PRODUCT_DIR) {
    throw new Error('PRODUCT_DIR not set.');
  }
  const context = require('ginjs').context; // eslint-disable-line global-require
  const contextTemplate = original();
  contextTemplate.STATIC_DIR = path.join(context.DATA_DIR || contextTemplate.DATA_DIR, 'statics');
  return contextTemplate;
};
