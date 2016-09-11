/* @flow */
const functions = {};

module.exports = functions;

functions.refine_getContextTemplate = (original: Function): Function => (): Object => {
  const context = original();
  context.STATIC_DIR = '';
  return context;
};
