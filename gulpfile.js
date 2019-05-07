const gulp = require('gulp');
const gutil = require('gulp-util');
const run = require('gulp-run');
const runSequence = require('run-sequence');

// Main gulp config file
const config = require('./gulp-config.js');

// Get all subtasks from ./gulp-tasks
gulp.task('clean', require('./gulp-tasks/clean')(gulp, config));

// Styles
gulp.task('styles:build', ['styles:lint'], require('./gulp-tasks/styles')(gulp, config));
gulp.task('styles:lint', require('./gulp-tasks/styles-lint')(gulp, config));
gulp.task('styles:watch', require('./gulp-tasks/styles-watch')(gulp, config));

// Images
gulp.task('images:build', require('./gulp-tasks/images')(gulp, config));
gulp.task('images:watch', require('./gulp-tasks/images-watch')(gulp, config));
gulp.task('svg-sprite', require('./gulp-tasks/svg-sprite')(gulp, config));

// Scripts
// gulp.task('scripts:lint', require('./gulp-tasks/scripts-lint')(gulp, config));
// var scriptsTasks = require('./gulp-tasks/scripts.js');
// scriptsTasks(gulp, config);

var scriptsRollupTasks = require('./gulp-tasks/scripts-rollup.js');
scriptsRollupTasks(gulp, config);

// PatternLab
// var patternLabTasks = require('./gulp-tasks/patternlab.js');
// patternLabTasks(gulp, config);

// browserSync
var browsersyncTasks = require('./gulp-tasks/browsersync.js');
browsersyncTasks(gulp, config);



/**
 * Default task (build:prod).
 */
gulp.task('default', function () {
    gulp.start('build:prod');
});


/**
 * Prod task.
 */
gulp.task('build:prod', function (cb) {
  gutil.env.type = 'prod';
  runSequence(
    'clean',
    ['styles:build', 'images:build', 'svg-sprite'],
    ['scripts:rollup', 'scripts:copy'],
    cb
  );
});


/**
 * Dev tasks.
 */

// Serve and watch the dev build
gulp.task('serve:dev', ['styles:watch', 'scripts:rollup:watch', 'scripts:copy', 'images:watch'], function () {
  gulp.start(['browsersync:site']);
});

// Serve the prod build
gulp.task('serve:prod', ['build:prod']);
