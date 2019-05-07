module.exports = {
  paths: {
    src: {
      baseDir: 'assets/src/',
      css: 'sass/',
      js: 'js/',
      images: 'images/',
      fonts: 'fonts/',
    },
    dist: {
      baseDir: 'assets/dist/',
      css: 'css/',
      js: 'js/',
      images: 'images/',
      fonts: 'fonts/',
    },
  },

  browserSync: {
    notify: false,
    open: true,
    notify:             false,
    open:               true,
    server: {
        baseDir:        './'
    },

    // proxy: 'chfa.lndo.site',

    // If you want to specify your IP adress (on more complex network), uncomment the 'host' option and update it
    // host: '192.168.0.1',

    // If you want to run as https, uncomment the 'https' option
    // https: false
  },

  libsass: {
    errLogToConsole: false,
    sourceMap: true,
    sourceComments: true,
    precision: 10,
    outputStyle: 'expanded',
    imagePath: 'assets/src/images',
    includePaths: [
      './node_modules/susy/sass',
      './node_modules/normalize-scss/sass/normalize',
      './node_modules/sass-rem'
    ]
  },

  cssnano: {
    safe: true
  },

  sassLint: {
    configFile: '.sass-lint.yml'
  },

  uglify: {
    compress: {
      pure_funcs: ['console.log']
    },
    preserveComments: 'license'
  },

  eslint: {
    configFile: './.eslintrc'
  },

  imagemin: {
    progressive: true,
    interlaced: true,
    optimizationLevel: 3
  },

  svgSprite: {
    mode: {
      css: false,
      inline: true,
      symbol: true
    }
  },

  browserify: {
    entries: ['./assets/src/js/app.js'],
    debug: true
  },
}
