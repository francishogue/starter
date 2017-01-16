/* jshint node:true */
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


// Options, project specifics
var options = {};

// var config = require('./gulp-config.js');
// gutil.log(config);

// browserSync options

// If you already have a server
// Comment out the 'server' option (below)
// Uncomment the 'proxy' option and update its value in 'gulp-config.json'
// You can easily create 'gulp-config.json' from 'gulp-config-sample.json'
// Uncomment 'var config' line below

// Custom browserSync config
// var config = require('./gulp-config.json');

options.browserSync = {
    notify: false,
    open: true,
    server: {
        baseDir: './'
    },

    //proxy: config.browsersync.proxy,

    // If you want to specify your IP adress (on more complex network), uncomment the 'host' option and update it
    //host: config.browsersync.host,

    // If you want to run as https, uncomment the 'https' option
    // https: true
};


// Paths settings
options.distPath = 'assets/dist/';         // path to your assets distribution folder
options.srcPath = 'assets/src/';        // path to your assets source folder

options.paths = {
    sass: options.srcPath + 'sass/',
    js: options.srcPath + 'js/',
    images: options.srcPath + 'images/',
    fonts: options.srcPath + 'fonts/',
    destCss: options.distPath + 'css/',
    destJs: options.distPath + 'js/',
    destImages: options.distPath + 'images/',
    destFonts: options.distPath + 'fonts/'
};

// gulp-sass options
options.libsass = {
    errLogToConsole: false,
    sourceMap: true,
    sourceComments: true,
    precision: 10,
    outputStyle: 'expanded',
    imagePath: 'assets/src/images',
    includePaths: [
        './node_modules/susy/sass',
        './node_modules/normalize-scss/sass/normalize'
    ]
};

// gulp-uglify
options.uglify = {
    compress: {
        pure_funcs: ['console.log']
    }
};

// gulp-imagemin
options.imagemin = {
    progressive: true,
    interlaced: true,
    optimizationLevel: 3
};

// Basic configuration example
options.svgprite = {
    mode: {
        css: false,
        inline: true,
        symbol: true
    }
};

var browserify_config = {
    entries: ['./assets/src/js/app.js'],
    debug: true
};


// Delete the dist directory
gulp.task('clean', function (cb) {
    rimraf(options.distPath, cb);
});


// browser-sync task for starting the server. (Use the built-in server or use your existing one by filling the proxy options)
gulp.task('browser-sync', function () {
    browserSync(options.browserSync);
});


// Node Sass
gulp.task('sass', function () {
    // List all .scss files that need to be processed
    return gulp.src([
            options.paths.sass + 'main.scss'
        ])

        .pipe(sourcemaps.init())

        .pipe(sass(options.libsass))

        // Catch any SCSS errors and prevent them from crashing gulp
        .on('error', function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        })

         .pipe(postcss([ autoprefixer(options.autoprefixer), cssnano({safe: true}) ]))

        // Write final .map file for Dev only
        .pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write())

        // Output the processed CSS
        .pipe(gulp.dest(options.paths.destCss))

        .pipe(size({title: 'CSS'}))
        .pipe(reload({stream: true}));
});


// Copy Modernizr
gulp.task('modernizr', function () {
    return gulp.src([
            options.paths.js + 'modernizr-custom.js'
        ])
        .pipe(gulp.dest(options.paths.destJs));
});


// SVG sprite
gulp.task('svg', function () {
    return gulp.src(options.paths.images + '**/*.svg')
        .pipe(svgSprite(options.svgprite))
        .pipe(gulp.dest(options.paths.destImages));
});


// Images
gulp.task('images', function () {
    return gulp.src(options.paths.images + '**/*')
        .pipe(changed(options.paths.destImages)) // Ignore unchanged files
        .pipe(imagemin(options.imagemin)) // Optimize
        .pipe(gulp.dest(options.paths.destImages));
});


// Fonts
gulp.task('fonts', function () {
    return gulp.src(options.paths.fonts + '**/*.{ttf,woff,woff2,eot,svg}')
        .pipe(changed(options.paths.destFonts)) // Ignore unchanged files
        .pipe(gulp.dest(options.paths.destFonts));
});


// Sass lint task
gulp.task('sasslint', function () {
    return gulp.src(options.paths.sass + '**/*.s+(a|c)ss')
        .pipe(sassLint({
            configFile: '.sass-lint.yml'
        }))
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
        args = _.assign({}, watchify.args, browserify_config);
    } else {
        args = _.assign({}, watchify.args, browserify_config, { debug: true });
    }

    var bundler = browserify(args);

    bundler.transform(babelify);


    var rebundle = function() {
        var bundleTimer = duration('Javascript bundle time');

        return bundler.bundle()
            .on('error', mapError) // Map error reporting
            .pipe(source('app.js')) // Set source name
            .pipe(buffer()) // Convert to gulp pipeline
            .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
            .pipe(rename({
                dirname: '',
                basename: 'bundle'
            }))
            .pipe(gutil.env.type === 'prod' ? uglify(options.uglify) : gutil.noop())
            .pipe(sourcemaps.write('./', {sourceRoot: './'})) // Set folder for sourcemaps to output to
            .pipe(gulp.dest(options.paths.destJs)) // Set the output folder
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
            options.paths.js + '**/*.js'
        ])
        .pipe(eslint({
            configFile: './.eslintrc.yml'
        }))
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
        gulp.watch(options.paths.sass + '**/*.scss', ['sass', 'sasslint'])
            .on('change', function (evt) {
                console.log(
                    '[watcher] File ' + evt.path.replace(/.*(?=sass)/, '') + ' was ' + evt.type + ', compiling...'
                );
            });

        // Watch images
        gulp.watch(options.paths.images + '**/*', ['images']);

        // Watch JS is part of the scripts task using watchify
    }
);

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync(options.browserSync);
});

gulp.task('build', ['clean'], function () {
    gutil.env.type = 'prod';
    gulp.start('sass', 'sasslint', 'scripts', 'jslint', 'images', 'svg', 'fonts');

    return gulp.src(options.distPath + '**/*').pipe(size({title: 'build', gzip: false}));
});

gulp.task('default', function () {
    gulp.start('build');
});
