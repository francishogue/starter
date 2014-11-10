starter
=======

HTML, Sass, JS starter kit running on Gulp.

## Requirements
 - Node
 - Ruby
 - Bundler (gem install bundler)
 - Gulp (npm install --global gulp)
 - bower (not exactly required but very useful to quickly add librairies to your project)
	- bower search plugin
	- copy the required files manually into your project from /bower_components

## Installation
- npm install
- bundle install

## Configuration
- gulpfile
	- BrowserSync
		- If you already have a server,
		- comment out the 'server' option (right below) and
		- uncomment the 'proxy' option and update its value in 'gulp-config.json'.
		- You can easily create 'gulp-config.json' by dupplicating 'gulp-config-sample.json'.
- Sass
	- _mixins.scss
		- Pick your mediaquery solution (desktop first or mobile first): comment out the one you don't need
	- _variables.scss
		- If you need Jeet grid system - take the time to set it up correctly

# Usage
```Shell
- gulp serve 				-> build for dev
- gulp 						-> build for prod
- gulp serve:dist 			-> build and serve the output from the dist build
```

## ToDo's
- ~~review TITOOLBOX.isMobile() (we could find a more bulletproof solution)~~
	- Looks like [device.js](https://github.com/matthewhudson/device.js) is a lot better/solid
- ~~add commonly used mixins (transitions)~~
- add SCSS lint
- ~~add jshint~~
