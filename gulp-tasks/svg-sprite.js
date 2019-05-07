const svgSprite = require('gulp-svg-sprite');

module.exports = (gulp, config) => {
  return function () {
    gulp.src(`${config.paths.src.baseDir}${config.paths.src.images}**/*.svg`)
      .pipe(svgSprite(config.svgSprite))
      .pipe(gulp.dest(`${config.paths.dist.baseDir}${config.paths.dist.images}`));
  };
};
