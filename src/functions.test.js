// eslint-disable-next-line import/no-extraneous-dependencies
const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const tasks = require('ginjs').tasks;

describe('getContextTemplate refinement', () => { // eslint-disable-line no-undef
  it('Introduces STATIC_DIR key to context.json', () => { // eslint-disable-line no-undef
    process.env.PRODUCTLINE_DIR = path.join(os.tmpdir(), '_ginjs-test-productline');
    process.env.PATH = `${process.env.PRODUCTLINE_DIR}/node_modules/.bin:${process.env.PATH}`;
    process.env.NODE_PATH = `${process.env.PRODUCTLINE_DIR}/features:${process.env.PRODUCTLINE_DIR}/node_modules:${process.env.NODE_PATH}`;
    // To be sure new NODE_PATH is used:
    require('module').Module._initPaths(); // eslint-disable-line no-underscore-dangle, global-require
    process.chdir(os.tmpdir());
    tasks.createProductLine('_ginjs-test-productline');
    process.env.PRODUCT_DIR = path.join(process.env.PRODUCTLINE_DIR, 'products', 'default');
    /*
     * Reset function module because tasks.createProductLine forces composition
     * of functions module, but we change the features later dynamically.
     * To get those features composed we need this pattern...
     */
    Object.keys(require.cache).forEach((elem: string) => {
      delete require.cache[elem];
    });
    const gap = require('gap'); // eslint-disable-line import/no-extraneous-dependencies, global-require, import/no-unresolved
    gap.composables.functions.introduce_test = (): string => 'i introduced a function';
    gap.composables.functions.refine_getContextTemplate = (): Function => (): object => { // eslint-disable-line max-len, arrow-body-style
      return {
        refined: true,
      };
    };
    const functions = require('ginjs').functions; // eslint-disable-line global-require
    expect(functions.test() === 'i introduced a function').to.be.true; // eslint-disable-line no-unused-expressions
    expect(functions.getContextTemplate().refined).to.be.true; // eslint-disable-line no-unused-expressions, max-len
    fs.removeSync(process.env.PRODUCTLINE_DIR);
    delete process.env.PRODUCTLINE_DIR;
    delete process.env.PRODUCT_DIR;
    Object.keys(require.cache).forEach((elem: string) => {
      delete require.cache[elem];
    });
  });
});
