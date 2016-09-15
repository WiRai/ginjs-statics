/* @flow */
const path = require('path');
const functions = {};

module.exports = functions;

/**
 * @function refine_getContextTemplate
 * @description Refines getContextTemplate to add a STATIC_DIR key.
 * @returns {void} Void.
 */
functions.refine_getContextTemplate = (original: Function): Function => (): Object => {
  if (!process.env.PRODUCT_DIR) {
    throw new Error('PRODUCT_DIR not set.');
  }
  const context = original();
  // noFlow
  context.STATIC_DIR = path.join(process.env.PRODUCT_DIR, 'DATA', 'statics');
  return context;
};
