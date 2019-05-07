const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');

module.exports = (gulp, config) => {
  return function () {
    gulp.src(`${config.paths.src.baseDir}${config.paths.src.images}**/*`)
      .pipe(changed(config.paths.dist.images)) // Ignore unchanged files
      .pipe(imagemin(config.imagemin)) // Optimize
      // .pipe(gutil.env.type === 'prod' ? gutil.noop() : gulp.dest(`${config.patternLab.dir}${config.patternLab.publicImagesDir}`))
      .pipe(gulp.dest(`${config.paths.dist.baseDir}${config.paths.dist.images}`));
  };
};
