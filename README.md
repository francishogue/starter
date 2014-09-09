starter
=======

HTML, SASS, JS starter kit running on Gulp.

## Requirements
 - Node
 - Ruby
 - Bundler (gem install bundler)
 - Gulp
 - bower (not exactly required but very useful to quickly add librairies to your project)
	- bower search plugin
	- copy the required files manually into your project from /bower_components

## Installation
- npm install
- bundle install

## Configuration
- gulpfile
	- update options.browserSync to match your needs (all infos are in there)
- sass
	- _mixins.scss
		- Pick your mediaquery solution: comment out the one you don't need
	- _variables.scss
		- If you need Susy grid - take the time to set it up correctly

# Usage
- gulp serve 				-> build for dev
- gulp 					-> build for prod
- gulp serve:dist 			-> build and serve the output from the dist build

## ToDo's
- review TITOOLBOX.isMobile() (we could find a more bulletproof solution)
- add commonly used mixins (transitions)
- add SCSS lint
- add jshint
