starter
=======

HTML, Sass, JS starter kit running on Gulp, LibSass and Rollup.

## Requirements
- Node (8.10.x)
- npm (5.6.x)
- browser-sync (```npm install -g browser-sync```) (2.12.x)
- Gulp (```npm install -g gulp```) ([CLI] v1.2.1)

## Installation
- `yarn` or `npm install`

## Configuration
In `gulp-config.js`
- Update `browser-sync` settings to match your project
  - `proxy`
  - `https`
  - `serve` (need to comment it out if using a proxy setting)

## Usage
### NPM tasks
```Shell
- npm run serve          -> serve for dev
- npm run build          -> build for prod
- npm run serve-prod     -> build and serve the output from the prod build and settings
```

### Breakpoint Mixins

#### `min-width` mixins
*** *use this only when paired with Susy's mixins* ***
```CSS
@include mq(xsmall) {}
@include mq(small) {}
@include mq(medium) {}
@include mq(large) {}
@include mq(xlarge) {}
```

#### `max-width` mixins
*** *don't use this with Susy's mixins inside* ***
```CSS
@include mq-down(xsmall) {}
@include mq-down(small) {}
@include mq-down(medium) {}
@include mq-down(large) {}
@include mq-down(xlarge) {}
```

#### `min-width` and `max-width` mixins
*** *don't use this with Susy's mixins inside* ***
```CSS
@include mq-only(xsmall) {}
@include mq-only(small) {}
@include mq-only(medium) {}
@include mq-only(large) {}
@include mq-only(xlarge) {}
```

### SVG sprite
``` HTML
<svg class="">
  <use xlink:href="path/to/sprite/assets/dist/images/symbol/svg/sprite.symbol.svg#svg--icon-name"></use>
</svg>
```


## ToDo's
- update JS structure and ES6 setup (rollup, parcel?)
  - one bundle vs multiple files
  - ES6 polyfills
  - vendors
- update all `npm` plugins

## Ideas
- accessibility testing (gulp plugin)
