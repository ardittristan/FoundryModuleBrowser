const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: ''
    },
    optimization: {
        mangleWasmImports: true,
        removeAvailableModules: true,
        minimizer: [new TerserPlugin()]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "plugins": [
                                "@babel/plugin-proposal-optional-chaining",
                                "@babel/plugin-transform-react-jsx"
                            ]
                        }

                    },
                    {
                        loader: "string-replace-loader",
                        options: {
                            search: '\/?\/?[ \s]*@replaceStart([^]*)@replaceEnd',
                            replace: "",
                            flags: 'g'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            import: true
                        }
                    },
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=10000&name=img/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        })
    ]
};