var path = require('path')
var webpack = require('webpack')
var px2rem = require('postcss-px2rem')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        app: './index',
        vendor: [
            'react'
        ]
    },
    output: {
        path: path.join(__dirname), //文件发布路径
        filename: 'bundle.js',
        publicPath: './' //html中引用的路径
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('app.css', {allChunks: true}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
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
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
            }
        ]
    },
    postcss: function() {
        return [px2rem({remUnit: 64})];
    }
}
