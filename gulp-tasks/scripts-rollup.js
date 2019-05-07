const gulp = require('gulp');
const gutil = require('gulp-util');
const rollupEach = require('gulp-rollup-each');
const babel = require('rollup-plugin-babel');
const sourcemaps = require('gulp-sourcemaps');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupEslint = require('rollup-plugin-eslint');
const path = require('path');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const size = require('gulp-size');


module.exports = (gulp, config) => {

  const bundleFiles = [
    './assets/src/js/*.js'
  ];

  const copyFiles = [
    './assets/src/js/vendor/*.js'
  ];

  gulp.task( 'scripts:rollup', () => {
    return gulp.src(bundleFiles, { base: "./assets/src/js/" })
      .pipe(plumber({ errorHandler: function(err) {
        notify.onError({
          title: "Gulp error in " + err.plugin,
          message:  err.toString()
        })(err);
        gutil.beep();
      }}))
      .pipe(gutil.env.type !== 'prod' ? sourcemaps.init({loadMaps: true}) : gutil.noop()) // Extract the inline sourcemaps
      .pipe(rollupEach({
        external: [
          'jquery',
          'slick-carousel',
        ],
        plugins: [
          rollupResolve(),
          rollupCommonjs(),
          // rollupEslint.eslint(),
          babel({
            presets: [['@babel/preset-env', {
              useBuiltIns: false,
            }]],
            externalHelpers: false,
            babelrc: false,
            exclude: 'node_modules/**', // only transpile our source code
            // plugins: ['@babel/plugin-external-helpers'],
          })
        ]
      }, function(file) {
        return {
          name: 'mir_' + path.posix.basename(file.path, '.es6.js'),
          format: 'iife',
          globals: {
            jquery: 'jQuery',
          }
        };
      }))
      .pipe(rename(function (path) {
        path.basename = path.basename.replace('.es6', '');
        // path.basename = path.basename.replace('.drupal', '');
      }))
      .pipe(rename({
        suffix: '.min',
      }))
      .pipe(gutil.env.type !== 'prod' ? sourcemaps.write('./', {sourceRoot: './'}) : gutil.noop()) // Set folder for sourcemaps to output to
      .pipe(gutil.env.type === 'prod' ? uglify(config.uglify) : gutil.noop())
      .pipe(size({ title: 'JS' }))
      .pipe(gulp.dest('assets/dist/js/')); // Output each [name].bundle.js file next to it’s source
  } );

  gulp.task('scripts:copy', () => {
    return gulp.src(copyFiles, { base: "./assets/src/js/" })
      .pipe(gulp.dest('assets/dist/js/'));
  });

  gulp.task('scripts:rollup:watch', function () {
    gulp.watch([ './assets/src/js/**/*.js' ], ['scripts:rollup:reload']);
  });

  gulp.task('scripts:rollup:reload', ['scripts:rollup', 'scripts:copy'], function (done) {
      browserSync.get('Site').reload();
      // browserSync.get('PatternLab').reload();
      done();
  });

};
