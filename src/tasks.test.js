const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
let tasks = require('ginjs').tasks;

const skelPath = require.resolve('ginjs').split(path.sep);

describe('collectStatics introducement', () => {
  it('Copy-overrides content of dirs called \'statics\' in each feature root to STATIC_DIR from context.json.', () => {
    process.env.PRODUCTLINE_DIR = path.join(os.tmpdir(), '_ginjs-test-productline');
    process.env.PATH = `${process.env.PRODUCTLINE_DIR}/node_modules/.bin:${process.env.PATH}`;
    process.env.NODE_PATH = `${process.env.PRODUCTLINE_DIR}/features:${process.env.PRODUCTLINE_DIR}/node_modules:${process.env.NODE_PATH}`;
    // Tp be sure new NODE_PATH is used:
    require('module').Module._initPaths();
    process.chdir(os.tmpdir());
    tasks.createProductLine('_ginjs-test-productline');
    process.env.PRODUCT_DIR = path.join(process.env.PRODUCTLINE_DIR, 'products', 'default');
    tasks.createFeature('gap2');
    const gapStatics = path.join(process.env.PRODUCTLINE_DIR, 'features', 'gap', 'statics');
    const gap2Statics = path.join(process.env.PRODUCTLINE_DIR, 'features', 'gap2', 'statics');
    fs.mkdirsSync(gapStatics);
    fs.mkdirsSync(gap2Statics);
    fs.writeJSONSync(path.join(gapStatics, 'a.json'), {
      foo: true,
    });
    fs.writeJSONSync(path.join(gapStatics, 'b.json'), {
      foo: true,
    });
    fs.writeJSONSync(path.join(gap2Statics, 'a.json'), {
      bar: true,
    });
    fs.writeJSONSync(path.join(process.env.PRODUCT_DIR, 'features.json'), [
      require.resolve('../index'), // ginjs-statics
      'gap',
      'gap2',
    ]);
    /*
     * Reset tasks module because require tasks forces composition
     * of tasks module, but we add features later dynamically.
     * To get those features composed we need this pattern...
     */
    delete require.cache[require.resolve('ginjs')];
    delete require.cache[require.resolve('ginjs/lib/tasks')];
    /* getContextTemplate used by updateContext is in functions,
     * we need to reload it for new composition
     */
    delete require.cache[require.resolve('ginjs/lib/functions')];
    tasks = require('ginjs').tasks;
    tasks.updateContext();
    // reload context to get STATIC_DIR
    delete require.cache[require.resolve('ginjs')];
    delete require.cache[require.resolve('ginjs/lib/context')];
    tasks.collectStatics();
    const staticDir = require('ginjs').context.STATIC_DIR;
    expect(
      fs.readJSONSync(path.join(staticDir, 'a.json')).bar &&
      fs.readJSONSync(path.join(staticDir, 'a.json')).foo === undefined
    ).to.be.true;
    expect(
      fs.readJSONSync(path.join(staticDir, 'b.json')).foo
    ).to.be.true;
    fs.removeSync(process.env.PRODUCTLINE_DIR);
    delete process.env.PRODUCTLINE_DIR;
    delete process.env.PRODUCT_DIR;
  });
});
