const browserSync = require('browser-sync');
const browserSyncSite = require('browser-sync').create('Site');
const browserSyncPL = require('browser-sync').create('PatternLab');

module.exports = (gulp, config) => {

  gulp.task('browsersync:site', function () {
    browserSyncSite.init(config.browserSync);
  });

  // gulp.task('browsersync:pl', function () {
  //   browserSyncPL.init({
  //     open: false,
  //     server: {
  //       baseDir: './'
  //     },
  //     startPath: 'pattern-lab/public',
  //     port: 8080,
  //     ui: {
  //       port: 8081
  //     },
  //     notify: false,
  //   });
  // });
};
