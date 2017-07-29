const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        main: [
            path.join(__dirname, 'src/api.ts'),
            path.join(__dirname, 'src/parser.ts'),
            path.join(__dirname, 'src/helpers.ts'),
            path.join(__dirname, 'src/tooltip.ts'),
            path.join(__dirname, 'src/main.ts')
        ],
        vendor: ['moment', 'jquery', 'jquery-browserify', 'jquery-mousewheel', 'humanize-plus']
    },
    output: {
        path: path.join(__dirname, 'assets/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [

        // pack common vender files
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),

        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // minify
        // new webpack.optimize.UglifyJsPlugin()
    ]
};
