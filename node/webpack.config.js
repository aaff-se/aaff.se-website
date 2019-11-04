'use strict';

let PROD = JSON.parse(process.env.PROD_ENV || '0');
PROD = !!PROD;

const API_URL = JSON.stringify('https://cms.aaff.se');

let NODE_ENV =  JSON.stringify('development');
let VERBOSE = true;

if(PROD) {
	NODE_ENV = JSON.stringify('production');
	VERBOSE = false;
};

let env = {
	'NODE_ENV': NODE_ENV,
	'VERBOSE': VERBOSE,
	'API_URL': API_URL
};

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs-extra');

const BASE_DIR = path.resolve(__dirname);

const SRC_APP_DIR = path.resolve(__dirname, 'src/app');
const SRC_SERVER_DIR = path.resolve(__dirname, 'src/server');
const SRC_STATIC_DIR = path.resolve(__dirname, 'src/static');
const SRC_SW_DIR = path.resolve(__dirname, 'src/sw');

const BUILD_DIR = path.resolve(__dirname, 'build');
const BUILD_PUBLIC_DIR = path.resolve(__dirname, 'build/public');
const BUILD_SERVER_DIR = path.resolve(__dirname, 'build/server');

let app_plugins = {};
let server_plugins = {};
let sw_plugins = {};

let options = {
	children: true,
	chunks: false
};
app_plugins.prod = [
	new MiniCssExtractPlugin({filename: '[chunkhash].css', allChunks: true}),
	new webpack.DefinePlugin({
		'process.env': env
	}),
	function() {
		this.plugin("done", function(stats) {
			fs.outputFile(
				path.join(BUILD_SERVER_DIR, "stats.json"),
				JSON.stringify(stats.toJson().assetsByChunkName)
			);
		});
	}

];
app_plugins.dev = [
	new MiniCssExtractPlugin({filename: '[chunkhash].css', allChunks: true}),
	new webpack.DefinePlugin({
		'process.env': env
	}),
	function() {
		this.plugin("done", function(stats) {
			fs.outputFile(
				path.join(BUILD_SERVER_DIR, "stats.json"),
				JSON.stringify(stats.toJson().assetsByChunkName)
			);
		});
	}
];

server_plugins.prod = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	new CopyWebpackPlugin([{
		from: SRC_STATIC_DIR,
		to: BUILD_DIR,
		toType: 'dir',
	}])
];
server_plugins.dev = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	new CopyWebpackPlugin([{
		from: SRC_STATIC_DIR,
		to: BUILD_DIR,
		toType: 'dir',
	}])
];

sw_plugins.prod = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	new CleanWebpackPlugin({
		root: BUILD_DIR,
		verbose: false,
		dry: false,
		beforeEmit: true
	}),
];
sw_plugins.dev = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	new CleanWebpackPlugin({
		root: BUILD_DIR,
		verbose: true,
		dry: false,
		beforeEmit: true
	}),
];


const appLoaders = [
	{
		test: /\.js$/,
		include: SRC_APP_DIR,
		loader: 'babel-loader',
	},
	{
		test: /\.scss$/,
		use: [{
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
          },
          "sass-loader"
        ]
	}
];

const serverLoaders = [
	{
		test: /\.js$/,
		include: BASE_DIR,
		loader: 'babel-loader',
	},
	{
		test: /\.scss$/,
		loader: ('null-loader')
	}
];

const swLoaders = [
	{
		test: /\.js$/,
		include: BASE_DIR,
		loader: 'babel-loader',
	}
];

const serverAliases = {
	adaptors: path.resolve(SRC_APP_DIR, 'adaptors/server'),
	app: path.resolve(SRC_APP_DIR),
	components: path.resolve(SRC_APP_DIR, 'components'),
	lib: path.resolve(SRC_APP_DIR, 'lib'),
}

const clientAliases = {
	adaptors: path.resolve(SRC_APP_DIR, 'adaptors/client'),
	app: path.resolve(SRC_APP_DIR),
	components: path.resolve(SRC_APP_DIR, 'components'),
	lib: path.resolve(SRC_APP_DIR, 'lib')
}

module.exports = [
	{
		name: 'client',
		target: 'web',
		mode: (PROD ? 'production':'development'),
		context: SRC_APP_DIR,
		node: {
      fs: 'empty',
		},
		entry: {
			app: './index.js'
		},
		output: {
			path: BUILD_PUBLIC_DIR,
			filename: '[chunkhash].js'
		},
		optimization: {
			minimize: (PROD ? true:false),
			splitChunks: {
        // include all types of chunks
        chunks: 'all'
      },
		},
		module: {
			rules: appLoaders
		},
		resolve: {
			alias: clientAliases
		},
		plugins: (PROD ? app_plugins.prod : app_plugins.dev)
	},
	{
		name: 'server',
		target: 'node',
		mode: (PROD ? 'production':'development'),
		context: SRC_SERVER_DIR,
		node: {
		  __dirname: false,
		  __filename: false,
		},
		entry: {
			server: './index.js'
		},
		optimization: {
			minimize: (PROD ? true:false),
		},
		output: {
			path: BUILD_SERVER_DIR,
			filename: 'index.js',
			libraryTarget: 'commonjs2'
		},
		externals: /^[a-z\-0-9]+$/,
		module: {
			rules: serverLoaders
		},
		resolve: {
			alias: serverAliases
		},
		plugins: (PROD ? server_plugins.prod : server_plugins.dev)
	},
	{
		name: 'serviceworker',
		target: 'web',
		mode: (PROD ? 'production':'development'),
		context: SRC_SW_DIR,
		node: {
		  __dirname: false,
		  __filename: false,
		},
		entry: {
			sw: './sw.js'
		},
		output: {
			path: BUILD_PUBLIC_DIR,
			filename: 'sw.js'
		},
		optimization: {
			minimize: (PROD ? true:false),
		},
		externals: /^[a-z\-0-9]+$/,
		module: {
			rules: swLoaders
		},
		resolve: {
			alias: clientAliases
		},
		plugins: (PROD ? sw_plugins.prod : sw_plugins.dev)
	}
];
