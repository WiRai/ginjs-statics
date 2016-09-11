/* @flow */

const path = require('path');
const fs = require('fs-extra');

const tasks = {};

module.exports = tasks;

tasks.introduce_collectStatics = () => {
  const getFeatureList = require('ginjs').featureman.getFeatureList;
  // noFlow
  const context = require('ginjs').context;

  const featureList = getFeatureList();
  featureList.forEach((elem: Object) => {
    const staticPath = path.join(path.dirname(require.resolve(elem)), 'statics');
    if (fs.existsSync(staticPath)) {
      fs.copySync(staticPath, context.STATIC_DIR, {
        clobber: true,
      });
    }
  });
};
