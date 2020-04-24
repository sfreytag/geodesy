const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'Geodesy'
        }
    },
    pluginOptions: {
        // SCSS available in the components. None yet.
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, './src/styles/scss/app.scss')
            ]
        }
    },
    chainWebpack: config => {
        config.resolve.alias.set('rbush-knn', resolve('./node_modules/rbush-knn/rbush-knn.js'))
    }
}
