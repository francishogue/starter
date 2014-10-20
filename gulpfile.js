var gulp = 			require('gulp'),
	gutil = 		require('gulp-util'),
	del = 			require('del'),
	sass = 			require('gulp-ruby-sass'),
	autoprefixer = 	require('gulp-autoprefixer'),
	minifyCSS = 	require('gulp-minify-css'),
	concat = 		require('gulp-concat'),
	jshint = 		require('gulp-jshint'),
	uglify = 		require('gulp-uglify'),
	filter = 		require('gulp-filter'),
	scsslint = 		require('gulp-scss-lint'),
	plumber = 		require('gulp-plumber'),
	notify = 		require('gulp-notify'),
	size = 			require('gulp-size'),
	sourcemaps = 	require('gulp-sourcemaps'),
	browserSync = 	require('browser-sync'),
	imagemin = 		require('gulp-imagemin'),
	cache = 		require('gulp-cache'),
	changed = 		require('gulp-changed'),
	newer = 		require('gulp-newer'),
	reload = 		browserSync.reload;

// Custom config
var config = require('./gulp-config.json');

// Options, project specifics
var options = {};

// browserSync options 
options.browserSync = {
	notify: false,
	// If you already have a server,
	// comment out the 'server' option (right below) and
	// uncomment the 'proxy' option and update its value in 'gulp-config.json'.
	// You can easily create 'gulp-config.json' from 'gulp-config-sample.json'.
	server: {
		baseDir: "./"
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
	destImages: 	options.distPath + 'img/',
	destFonts: 		options.distPath + 'fonts/'
};

// gulp-ruby-sass options
options.sass = {
	style: 'expanded',
	precision: 10,
	bundleExec: true,
	require: ['susy']
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




// Delete the dist directory
gulp.task('clean', function(cb) {
	del([options.distPath], cb);
});


// browser-sync task for starting the server. (Use the built-in server or use your existing one by filling the proxy options)
gulp.task('browser-sync', function() {
	browserSync(options.browserSync);
});


// Sass
/**
 * 1. Run sass with bundle exec: bundle exec sass. For bundler to work correctly you must add the Gemfile and Gemfile.lock to your gulp.src() glob.
 * 2. Filtering stream to only css files (gulp-ruby-sass with sourcemap *.map)
 */
gulp.task('sass', function() {
	return gulp.src([options.paths.sass + '**/*.scss', 'Gemfile', 'Gemfile.lock']) /* 1 */
		.pipe(plumber(function(error) {
			gutil.beep();
			gutil.log(gutil.colors.red(error.message));
			notify(error.message);
			this.emit('end');
		}))
		.pipe(sass(options.sass))
		.pipe(autoprefixer(options.autoprefixer.support))
		.pipe(gutil.env.type === 'prod' ? minifyCSS() : gutil.noop())
		.pipe(gulp.dest(options.paths.destCss))
		.pipe(filter('**/*.css')) /* 2 */
		.pipe(notify('Sass processed'))
		.pipe(reload({stream:true}));
});


// JS
gulp.task('scripts', function() {
	return gulp.src([
		options.paths.js + 'libs/*.js', 
		options.paths.js + 'helpers.js', 
		options.paths.js + 'app.js', 
		'!' + options.paths.js + 'libs/modernizr.js'])
			.pipe(gutil.env.type !== 'prod' ? sourcemaps.init() : gutil.noop())
			// .pipe(sourcemaps.init())
			.pipe(concat('app.min.js'))
			.pipe(gutil.env.type === 'prod' ? uglify(options.uglify) : gutil.noop())
			// .pipe(uglify())
			.pipe(gutil.env.type !== 'prod' ? sourcemaps.write() : gutil.noop())
			// .pipe(sourcemaps.write())
			.pipe(gulp.dest(options.paths.destJs))
			.pipe(notify('JS processed'))
			.pipe(reload({stream: true, once: true}));
});


// Copy Modernizr
gulp.task('modernizr', function () {
  return gulp.src([options.paths.js + 'libs/modernizr.js'])
    .pipe(gulp.dest(options.paths.destJs));
});


// Images
gulp.task('images', function() {
	return gulp.src(options.paths.images + '**/*')
		.pipe(changed(options.paths.destImages)) // Ignore unchanged files
		.pipe(imagemin({
			progressive: true,
      		interlaced: true
		})) // Optimize
		.pipe(gulp.dest(options.paths.destImages));
});


// Fonts
gulp.task('fonts', function() {
	gulp.src(options.paths.fonts + '**/*.{ttf,woff,eof,svg}')
		.pipe(changed(options.paths.destFonts)) // Ignore unchanged files
		.pipe(gulp.dest(options.paths.destFonts));
});


// JS hint task (WIP)
// gulp.task('jshint', function() {
// 	gulp.src(options.paths.js + '*.js')
// 		.pipe(jshint('.jshintrc'))
// 		.pipe(jshint.reporter('jshint-stylish'));
// });


// SCSS lint (WIP)
// gulp.task('scss-lint', function() {
// 	gulp.src(options.paths.sass + '**/*.scss')
// 		.pipe(cache('scsslint'))
// 		.pipe(scsslint({
// 			customReport: scssLintReporter,
// 			config: 'scsslint.yml'
// 		}));
// });

// var scssLintReporter = function(file) {
// 	if (!file.scsslint.success) {
// 		gutil.log(file.scsslint.issues.length + ' issues found in ' + file.path);
// 		// file.scsslint.issues.forEach(function(result) {
// 		// 	gutil.log(result.reason+' on line '+result.line);
// 		// });
// 	}
// };


// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
	browserSync(options.browserSync);
});




// gulp serve 				-> build for dev
// gulp 					-> build for prod
// gulp serve:dist 			-> build and serve the output from the dist build

gulp.task('serve', ['sass', 'scripts', 'modernizr', 'images', 'fonts', 'browser-sync'], function () {

	// watch Sass
	gulp.watch(options.paths.sass + '**/*.scss', ['sass']);

	// watch JS
	gulp.watch(options.paths.js + '**/*.js', ['scripts']);

	// watch images
	gulp.watch(options.paths.images + '**/*', ['images']);

	// watch fonts
	gulp.watch(options.paths.fonts + '**/*.{ttf,woff,eof,svg}', ['fonts']);
});

gulp.task('build', ['sass', 'scripts', 'modernizr', 'images', 'fonts'], function () {
	return gulp.src(options.paths.dist + '**/*').pipe(size({title: 'build', gzip: false}));
});

gulp.task('default', ['clean'], function () {
	gutil.env.type = 'prod';
	gulp.start('build');
});