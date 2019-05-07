const del = require('del');

module.exports = (gulp, config) => {
  return function (cb) {
    del(config.paths.dist.baseDir).then(paths => {
      console.log('Deleted files and folders:\n', paths.join('\n'));
      cb();
    });
  };
};
