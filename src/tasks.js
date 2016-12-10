/* @flow */

const path = require('path');
const fs = require('fs-extra');

const tasks = {};

module.exports = tasks;
/*eslint-disable */
/**
 * @function introduce_collectStatics
 * @description Introduces task collectStatics to collect files from all directories 'statics' top level from each feature into STATIC_DIR from context.json.
 * @returns {void} Void.
 */
 /*eslint-enable */
tasks.introduce_collectStatics = () => {
  const getFeatureList = require('ginjs').featureman.getFeatureList; // eslint-disable-line global-require
  const context = require('ginjs').context; // eslint-disable-line global-require
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
