'use strict';

var path = require('path');
var fs = require('fs-extra');

var tasks = {};

module.exports = tasks;

/**
 * @function introduce_collectStatics
 * @description Introduces task collectStatics to collect files from all directories 'statics' top level from each feature into STATIC_DIR from context.json.
 * @returns {void} Void.
 */
tasks.introduce_collectStatics = function () {
  var getFeatureList = require('ginjs').featureman.getFeatureList;
  var context = require('ginjs').context;
  var featureList = getFeatureList();
  featureList.forEach(function (elem) {
    var staticPath = path.join(path.dirname(require.resolve(elem)), 'statics');
    if (fs.existsSync(staticPath)) {
      fs.copySync(staticPath, context.STATIC_DIR, {
        clobber: true
      });
    }
  });
};