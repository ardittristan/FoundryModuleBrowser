const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inlineSource: '.(js|css)$',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                useShortDoctype: true
            }
        }),

        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),

        new FileManagerPlugin({
            onEnd: [
                {
                    copy: [
                        { source: path.resolve(__dirname, 'dist', 'index.html'), destination: path.resolve(__dirname, 'index.html') }
                    ]
                }
            ]
        })
    ]
});