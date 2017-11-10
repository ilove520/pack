var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].js?[hash]-[chunkhash]'
    },
    resolve: {
        extension: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.(png|jpg|gif)$/,
                loaders:["url?limit=2000000"]
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000"
            }
        ]
    },
    devServer: {
        contentBase: "assets",
        inline: true,
        stats: { colors: true },
        historyApiFallback: true
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin("[name].css?[hash]-[chunkhash]", {
          allChunks: true,
          disable: false
        }),
        new HtmlWebpackPlugin({
            title: 'pack',
            template: 'index.html'
        }),
        new openBrowserWebpackPlugin({
            url: 'http://localhost:8080'
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        //用于压缩
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false//去注释
            },
            compress: {
                warnings: false
            }
        }),
        // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.DedupePlugin(),
        // 按引用频度来排序 ID，以便达到减少文件大小的效果
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        }),
        new webpack.NoErrorsPlugin()
    ],
    devtool: false
};
