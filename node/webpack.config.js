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
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
 
//needs compass-mixins installed
const COMPASS_MIXINS_DIR = path.resolve(__dirname, './node_modules/compass-mixins/lib');

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

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
	sourceMap: false,
	compress: {
		sequences: true,
		dead_code: true,
		conditionals: true,
		booleans: true,
		unused: true,
		if_return: true,
		join_vars: true,
		drop_console: true
	},
	mangle: {
		except: ['$super', '$', 'exports', 'require']
	},
	output: {
		comments: false
	}
});
let options = {
	children: true,
	chunks: false
};
app_plugins.prod = [
	new CleanWebpackPlugin(['build'], {
		root: BASE_DIR,
		verbose: false, 
		dry: false,
		exclude: ['buld/public/.well-known']

	}),
	new ExtractTextPlugin({filename: '[chunkhash].css', allChunks: true}),
	new webpack.DefinePlugin({
		'process.env': env
	}),
	uglifyPlugin,
	function() {
		this.plugin("done", function(stats) {
			require("fs").writeFileSync(
				path.join(BUILD_SERVER_DIR, "stats.json"),
			JSON.stringify(stats.toJson().assetsByChunkName));
		});
	}

];
app_plugins.dev = [
	new CleanWebpackPlugin(['build'], {
		root: BASE_DIR,
		verbose: true, 
		dry: false,
	}),
	new ExtractTextPlugin({filename: '[chunkhash].css', allChunks: true}),
	new webpack.DefinePlugin({
		'process.env': env
	}),
	function() {
		this.plugin("done", function(stats) {
			require("fs").writeFileSync(
				path.join(BUILD_SERVER_DIR, "stats.json"),
			JSON.stringify(stats.toJson().assetsByChunkName));
		});
	}
];

server_plugins.prod = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	uglifyPlugin,
	new CopyWebpackPlugin([{
		from: {
			glob: SRC_STATIC_DIR,
			dot: true
		},
		to: BUILD_DIR
	}])
];
server_plugins.dev = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	new CopyWebpackPlugin([{
		from: {
			glob: SRC_STATIC_DIR,
			dot: true
		},
		to: BUILD_DIR
	}])
];

sw_plugins.prod = [
	new webpack.DefinePlugin({
		'process.env': env
	}),
	uglifyPlugin
];
sw_plugins.dev = [
	new webpack.DefinePlugin({
		'process.env': env
	})
];


const appLoaders = [
	{
		test: /\.js$/,
		include: SRC_APP_DIR,
		loader: 'babel-loader',
		query: {
			presets: [
				'react',
				['es2015', {'modules': false}]
			]
		}
	},
	{
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: `css-loader!sass-loader?includePaths[]=${COMPASS_MIXINS_DIR}` })
	}
];

const serverLoaders = [
	{
		test: /\.js$/,
		include: BASE_DIR,
		loader: 'babel-loader',
		query: {
			presets: [
				'react',
				['es2015', {'modules': false}]
			]
		}
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
		query: {
			presets: [
				['es2015', {'modules': false}]
			]
		}
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
		context: SRC_APP_DIR,
		entry: {
			app: './index.js'
		},
		output: {
			path: BUILD_PUBLIC_DIR,
			filename: '[chunkhash].js'
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
		context: SRC_SERVER_DIR,
		node: {
		  __dirname: false,
		  __filename: false,
		},
		entry: {
			server: './index.js'
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
