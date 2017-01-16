module.exports = {
    browserSync: {
        notify: false,
        open: true,
        server: {
            baseDir: './'
        },

        //proxy: config.browsersync.proxy,

        // If you want to specify your IP adress (on more complex network), uncomment the 'host' option and update it
        //host: config.browsersync.host,

        // If you want to run as https, uncomment the 'https' option
        // https: true
    }
}
