// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
/* eslint-env commonjs */
// const webpack = require('webpack')

module.exports = {
    // eslint-disable-next-line no-unused-vars
    webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config
        config.module.rules.push({
            test: /\.(js)$/,
            use: 'eslint-loader'
        })
        // Important: return the modified config
        return config
    }
}