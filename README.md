starter
=======

HTML, Sass, JS starter kit running on Gulp. 

***using LibSass (can't use it with Susy)***

## Requirements
 - Node
 - Gulp (```npm install --global gulp```)

## Installation
- npm install

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
- gulp                -> build for prod
- gulp serve:dist     -> build and serve the output from the dist build
```

## ToDo's
- ~~review TITOOLBOX.isMobile() (we could find a more bulletproof solution)~~
	- Looks like [device.js](https://github.com/matthewhudson/device.js) is a lot better/solid, include it on a per project basis
- ~~add commonly used mixins (transitions)~~
- add SCSS lint
- ~~add jshint~~
