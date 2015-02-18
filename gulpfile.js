/* jshint node:true */

'use strict';

var gulp = 			require('gulp'),
	gutil = 		require('gulp-util'),
	del = 			require('del'),
	sass = 			require('gulp-sass'),
	autoprefixer = 	require('gulp-autoprefixer'),
	minifyCSS = 	require('gulp-minify-css'),
	concat = 		require('gulp-concat'),
	jshint = 		require('gulp-jshint'),
	uglify = 		require('gulp-uglify'),
	notify = 		require('gulp-notify'),
	size = 			require('gulp-size'),
	sourcemaps = 	require('gulp-sourcemaps'),
	browserSync = 	require('browser-sync'),
	imagemin = 		require('gulp-imagemin'),
	changed = 		require('gulp-changed'),
	reload = 		browserSync.reload;


// Options, project specifics
var options = {};

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
	server: {
		baseDir: './'
	},

	// proxy: config.browsersync.proxy,
	
	// If you want to specify your IP adress (on more complex network), uncomment the 'host' option and update it
	// host: config.browsersync.host,
	
	// If you want to run as https, uncomment the 'https' option
	// https: true
};


// Paths settings
options.distPath = 'assets/dist/'; 		// path to your assets distribution folder
options.srcPath = 'assets/src/';		// path to your assets source folder

options.paths = {
	sass: 			options.srcPath + 'sass/',
	js: 			options.srcPath + 'js/',
	images: 		options.srcPath + 'images/',
	fonts: 			options.srcPath + 'fonts/',
	destCss: 		options.distPath + 'css/',
	destJs: 		options.distPath + 'js/',
	destImages: 	options.distPath + 'images/',
	destFonts: 		options.distPath + 'fonts/'
};

// gulp-sass options
options.libsass = {
	errLogToConsole: false,
	sourceMap: true,
	sourceComments: true,
	precision: 10,
	outputStyle: 'expanded',
	imagePath: 'assets/src/images',
};

// gulp-autoprefixer
options.autoprefixer = {
	support: [
		'last 2 version', 
		'ie >= 8',
		'safari >= 6',
		'ios >= 6',
		'android >= 4',
		'bb >= 7'
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


// Delete the dist directory
gulp.task('clean', function(cb) {
	del([options.distPath], cb);
});


// browser-sync task for starting the server. (Use the built-in server or use your existing one by filling the proxy options)
gulp.task('browser-sync', function() {
	browserSync(options.browserSync);
});


// Node Sass
gulp.task('sass', function() {
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

		// Hotfix while gulp-sass sourcemaps gets fixed
		// https://github.com/dlmanning/gulp-sass/issues/106#issuecomment-60977513
		.pipe(sourcemaps.write())
		.pipe(sourcemaps.init({loadMaps: true}))

		// Add vendor prefixes
		.pipe(autoprefixer(options.autoprefixer.support))

		.pipe(gutil.env.type === 'prod' ? minifyCSS() : gutil.noop())
		
		// Write final .map file
		.pipe(sourcemaps.write())

		// Output the processed CSS
		.pipe(gulp.dest(options.paths.destCss))

		.pipe(notify('Sass compiled'))
		.pipe(size({title: 'CSS'}))
		.pipe(reload({stream:true}));
});

// JS
gulp.task('scripts', function() {
	return gulp.src([
			options.paths.js + 'libs/*.js', 
			options.paths.js + 'helpers.js', 
			options.paths.js + 'app.js', 
			'!' + options.paths.js + 'libs/modernizr.js'
		])
		.pipe(gutil.env.type !== 'prod' ? sourcemaps.init() : gutil.noop())
		.pipe(concat('app.min.js'))
		.pipe(gutil.env.type === 'prod' ? uglify(options.uglify) : gutil.noop())
		.pipe(gutil.env.type !== 'prod' ? sourcemaps.write() : gutil.noop())
		.pipe(gulp.dest(options.paths.destJs))
		.pipe(notify('JS compiled'))
		.pipe(reload({stream: true, once: true})
	);
});


// Copy Modernizr
gulp.task('modernizr', function () {
	return gulp.src([
			options.paths.js + 'libs/modernizr.js'
		])
		.pipe(uglify())
		.pipe(gulp.dest(options.paths.destJs)
	);
});


// Images
gulp.task('images', function() {
	return gulp.src(options.paths.images + '**/*')
		.pipe(changed(options.paths.destImages)) // Ignore unchanged files
		.pipe(imagemin(options.imagemin)) // Optimize
		.pipe(gulp.dest(options.paths.destImages));
});


// Fonts
gulp.task('fonts', function() {
	return gulp.src(options.paths.fonts + '**/*.{ttf,woff,eof,svg}')
		.pipe(changed(options.paths.destFonts)) // Ignore unchanged files
		.pipe(gulp.dest(options.paths.destFonts));
});


// JS hint task (WIP)
gulp.task('jshint', function() {
	return gulp.src([
		options.paths.js + '*.js',
		'./gulpfile.js'
	])
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'));
});


// gulp serve           -> build for dev
// gulp                 -> build for prod
// gulp serve:dist      -> build and serve the output from the dist build

gulp.task('serve', [
	'sass',
	'jshint',
	'scripts',
	'modernizr',
	'images',
	'fonts',
	'browser-sync'
	], function() {

		// Watch Sass
		gulp.watch(options.paths.sass + '**/*.scss', ['sass'])
		.on('change', function(evt) {
			// notify('[watcher] File ' + evt.path.replace(/.*(?=sass)/,'') + ' was ' + evt.type + ', compiling...');
		console.log(
			'[watcher] File ' + evt.path.replace(/.*(?=sass)/,'') + ' was ' + evt.type + ', compiling...'
		);
	});

	// Watch JS
	gulp.watch(options.paths.js + '**/*.js', ['jshint', 'scripts']);

	// Watch images
	gulp.watch(options.paths.images + '**/*', ['images']);

});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
	browserSync(options.browserSync);
});

gulp.task('build', ['sass', 'scripts', 'modernizr', 'images', 'fonts'], function () {
	return gulp.src(options.distPath + '**/*').pipe(size({title: 'build', gzip: false}));
});

gulp.task('default', ['clean'], function () {
	gutil.env.type = 'prod';
	gulp.start('build');
});