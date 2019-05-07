module.exports = (gulp, config) => {
  return function () {
    gulp.watch(config.paths.src.baseDir + config.paths.src.images + '**/*', ['images:build', 'svg-sprite']);
  }
};
