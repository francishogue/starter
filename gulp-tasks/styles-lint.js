const sassLint = require('gulp-sass-lint');

module.exports = (gulp, config) => {
  return function () {
    gulp.src([
      `${config.paths.src.baseDir}${config.paths.src.css}**/*.scss`,
    ])
      .pipe(sassLint(config.sassLint))
      .pipe(sassLint.format());
      // .pipe(sassLint.failOnError());
  };
};
