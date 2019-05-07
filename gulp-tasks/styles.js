/* eslint-disable */

const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');


module.exports = (gulp, config) => {
  return function () {
    // List all .scss files that need to be processed
    gulp.src([
      `${config.paths.src.baseDir}${config.paths.src.css}main.scss`,
    ])

    .pipe(sassGlob())

    .pipe(sourcemaps.init())

    .pipe(sass(config.libsass))

    // Catch any SCSS errors and prevent them from crashing gulp
    .on('error', function (error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    })

    .pipe(postcss([autoprefixer(), cssnano(config.cssnano)]))

    // Write final .map file for Dev only
    .pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write())

    // Output the processed CSS
    .pipe(gulp.dest(config.paths.dist.baseDir + config.paths.dist.css))

    // .pipe(gulp.dest(config.patternLab.dir + config.patternLab.sourceCssDir))

    // .pipe(gutil.env.type === 'prod' ? gutil.noop() : gulp.dest(config.patternLab.dir + config.patternLab.publicCssDir))

    .pipe(size({ title: 'CSS' }))
    .pipe(browserSync.get('Site').reload({ stream: true }))
    // .pipe(browserSync.get('PatternLab').reload({ stream: true }));
  };
};
