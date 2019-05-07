const eslint = require('gulp-eslint');

module.exports = (gulp, config) => {
  return function () {
    gulp.src([
      config.paths.src.baseDir + config.paths.src.js + '**/*.js'
    ])
      .pipe(eslint(config.eslint))
      .pipe(eslint.format());
    // .pipe(eslint.failAfterError());
  };
};
