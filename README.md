starter
=======

HTML, Sass, JS starter kit running on Gulp. 

***using LibSass, with Susy***

## Requirements
 - Node (v0.10.36)
 - npm (2.12.0)
 - browser-sync (```npm install -g browser-sync```) (2.0.1)
 - Gulp (```npm install -g gulp```) ([CLI] v3.9.0)
 - bower (not exactly required but very useful to quickly add librairies to your project)
	- bower search plugin
	- copy the required files manually into your project from /bower_components into /src//js/libs

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
- ~~review TITOOLBOX.isMobile() (we could find a more bulletproof solution)~~
	- Looks like [device.js](https://github.com/matthewhudson/device.js) is a lot better/solid, include it on a per project basis
- add SCSS lint 
