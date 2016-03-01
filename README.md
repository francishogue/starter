starter
=======

HTML, Sass, JS starter kit running on Gulp and ES2015

***using LibSass, with Susy***

## Requirements
 - Node (5.6.x)
 - npm (2.5.x)
 - browser-sync (```npm install -g browser-sync```) (2.0.1)
 - Gulp (```npm install -g gulp```) ([CLI] v3.9.0)

## Installation
- npm install

## Configuration
- gulpfile.js
	- BrowserSync
		- If you already have a server, read the instructions inside the gulpfile
- Sass
	- set Susy settings (if required) in _variables.scss
	- set other defaults in _variables.scss (font-stacks, link colors, etc)

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
