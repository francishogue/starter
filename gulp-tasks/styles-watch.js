module.exports = (gulp, config) => {
  return function () {
    gulp.watch([
      `${config.paths.src.baseDir}${config.paths.src.css}**/*.scss`,
    ], ['styles:lint', 'styles:build'])
    .on('change', function (evt) {
      console.log(
        '[watcher] File ' + evt.path.replace(/.*(?=sass)/, '') + ' was ' + evt.type + ', compiling...'
      );
    });
  };
};
