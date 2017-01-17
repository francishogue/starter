'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    svgSprite = require('gulp-svg-sprite'),
    reload = browserSync.reload,
    chalk = require('chalk'),
    duration = require('gulp-duration'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    _ = require('lodash');


var config = require('./gulp-config.js');

var paths = {
    src: {
        css:            config.paths.src.baseDir + config.paths.src.css,
        js:             config.paths.src.baseDir + config.paths.src.js,
        images:         config.paths.src.baseDir + config.paths.src.images,
        fonts:          config.paths.src.baseDir + config.paths.src.fonts,
    },
    dist: {
        css:            config.paths.dist.baseDir + config.paths.dist.css,
        js:             config.paths.dist.baseDir + config.paths.dist.js,
        images:         config.paths.dist.baseDir + config.paths.dist.images,
        fonts:          config.paths.dist.baseDir + config.paths.dist.fonts,
    }
};


// Delete the dist directory
gulp.task('clean', function (cb) {
    rimraf(config.paths.dist.baseDir, cb);
});


// browser-sync task for starting the server. (Use the built-in server or use your existing one by filling the proxy options)
gulp.task('browser-sync', function () {
    browserSync(config.browserSync);
});


// Node Sass
gulp.task('sass', function () {
    // List all .scss files that need to be processed
    return gulp.src([
            paths.src.css + 'main.scss'
        ])

        .pipe(sourcemaps.init())

        .pipe(sass(config.libsass))

        // Catch any SCSS errors and prevent them from crashing gulp
        .on('error', function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        })

        .pipe(postcss([ autoprefixer(), cssnano(config.cssnano) ]))

        // Write final .map file for Dev only
        .pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write())

        // Output the processed CSS
        .pipe(gulp.dest(paths.dist.css))

        .pipe(size({title: 'CSS'}))
        .pipe(reload({stream: true}));
});


// Copy Modernizr
// gulp.task('modernizr', function () {
//     return gulp.src([
//             options.paths.js + 'modernizr-custom.js'
//         ])
//         .pipe(gulp.dest(options.paths.destJs));
// });


// SVG sprite
gulp.task('svg', function () {
    return gulp.src(paths.src.images + '**/*.svg')
        .pipe(svgSprite(config.svgSprite))
        .pipe(gulp.dest(paths.dist.images));
});


// Images
gulp.task('images', function () {
    return gulp.src(paths.src.images + '**/*')
        .pipe(changed(paths.dist.images)) // Ignore unchanged files
        .pipe(imagemin(config.imagemin)) // Optimize
        .pipe(gulp.dest(paths.dist.images));
});


// Fonts
gulp.task('fonts', function () {
    return gulp.src(paths.src.fonts + '**/*.{ttf,woff,woff2,eot,svg}')
        .pipe(changed(paths.dist.fonts)) // Ignore unchanged files
        .pipe(gulp.dest(paths.dist.fonts));
});


// Sass lint task
gulp.task('sasslint', function () {
    return gulp.src(paths.src.css + '**/*.s+(a|c)ss')
        .pipe(sassLint(config.sassLint))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});


// JS lint task
gulp.task('jslint', function () {
    return runJSeslint();
});


// Script task
gulp.task('scripts', function(callback) {
    createBundle();
    return callback();
});

var createBundle = function(callback) {
    var args = null;

    if(gutil.env.type !== 'prod') {
        args = _.assign({}, watchify.args, config.browserify);
    } else {
        args = _.assign({}, watchify.args, config.browserify, { debug: true });
    }

    var bundler = browserify(args);

    bundler.transform(babelify);


    var rebundle = function() {
        var bundleTimer = duration('Javascript bundle time');

        return bundler.bundle()
            .on('error', mapError) // Map error reporting
            .pipe(source('app.js')) // Set source name
            .pipe(buffer()) // Convert to gulp pipeline
            .pipe(gutil.env.type !== 'prod' ? sourcemaps.init({loadMaps: true}) : gutil.noop()) // Extract the inline sourcemaps
            .pipe(rename({
                dirname: '',
                basename: 'bundle'
            }))
            .pipe(gutil.env.type === 'prod' ? uglify(config.uglify) : gutil.noop())
            .pipe(gutil.env.type !== 'prod' ? sourcemaps.write('./', {sourceRoot: './'}) : gutil.noop()) // Set folder for sourcemaps to output to
            .pipe(gulp.dest(paths.dist.js)) // Set the output folder
            .pipe(bundleTimer) // Output time timing of the file creation
            .pipe(browserSync.stream({once: true}));
    };

    if(gutil.env.type !== 'prod') {
        bundler = watchify(bundler);
    }

    bundler.on('update', function(id) {
        runJSeslint(callback, id);
        rebundle();
    });

    bundler.on('log', gutil.log);

    return rebundle();
};


var runJSeslint = function(callback, src) {
    return gulp.src([
            paths.src.js + '**/*.js'
        ])
        .pipe(eslint(config.eslint))
        .pipe(eslint.format());
        // .pipe(eslint.failAfterError());
};


// Error reporting function
function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
}


gulp.task('serve', [
        'sass',
        'sasslint',
        'scripts',
        'jslint',
        'images',
        'svg',
        'fonts',
        'browser-sync'
    ], function () {

        // Watch Sass
        gulp.watch(paths.src.css + '**/*.scss', ['sass', 'sasslint'])
            .on('change', function (evt) {
                console.log(
                    '[watcher] File ' + evt.path.replace(/.*(?=sass)/, '') + ' was ' + evt.type + ', compiling...'
                );
            });

        // Watch images
        gulp.watch(paths.src.images + '**/*', ['images', 'svg']);

        // Watch JS is part of the `scripts` task using watchify
    }
);

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync(config.browserSync);
});

gulp.task('build', ['clean'], function () {
    gutil.env.type = 'prod';
    gulp.start('sass', 'sasslint', 'scripts', 'jslint', 'images', 'svg', 'fonts');

    return gulp.src(config.paths.dist + '**/*').pipe(size({title: 'build', gzip: false}));
});

gulp.task('default', function () {
    gulp.start('build');
});
