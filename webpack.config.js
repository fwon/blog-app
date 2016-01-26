var path = require('path')
var webpack = require('webpack')
var px2rem = require('postcss-px2rem')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './index'
    ],
    output: {
        path: path.join(__dirname),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                  'babel'
                ],
                exclude: /node_modules/,
                include: __dirname
            },
            { 
                test: /\.css$/,
                loader: "style!css"
            },
            { 
                test: /\.less$/,
                loader: "style!css!postcss!less"
            },
        ]
    },
    postcss: function() {
        return [px2rem({remUnit: 64})];
    }
}