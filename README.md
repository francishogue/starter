starter
=======

HTML, Sass, JS starter kit running on Gulp. 

***using LibSass, with Susy***

## Requirements
 - Node
 - ~~Ruby~~ (not required because of LibSass)
 - ~~Bundler (```gem install bundler```)~~ (not required because of LibSass)
 - Gulp (```npm install --global gulp```)
 - bower (not exactly required but very useful to quickly add librairies to your project)
	- bower search plugin
	- copy the required files manually into your project from /bower_components

## Installation
- npm install
- ~~bundle install~~

## Configuration
- gulpfile.js
	- BrowserSync
		- If you already have a server, read the instructions inside the gulpfile
- Sass
	- _mixins.scss
		- Pick your mediaquery solution (desktop first or mobile first): comment out the one you don't need
	- _variables.scss

## Usage
```Shell
- gulp serve          -> build for dev
- gulp build          -> build for prod
- gulp serve:dist     -> build and serve the output from the dist build
```

## Media Queries list
#### Desktop first
```
- xlarge (or default) which represents 1025px and up
- xxl     --> min-width: 1200px
- large   --> max-width: 1024px
- medium  --> max-width: 767px
- small   --> max-width: 599px
- xsmall  --> max-width: 479px
```

## ToDo's
- ~~review TITOOLBOX.isMobile() (we could find a more bulletproof solution)~~
	- Looks like [device.js](https://github.com/matthewhudson/device.js) is a lot better/solid, include it on a per project basis
- ~~add commonly used mixins (transitions)~~
- add SCSS lint 
- ~~add jshint~~
