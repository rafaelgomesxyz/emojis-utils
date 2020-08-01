const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack'); // eslint-disable-line

/**
 * @typedef {Object} Environment
 * @property {boolean} development
 * @property {boolean} watch
 */

/**
 * @param {Environment} env
 * @param {boolean} doMinify
 * @returns {webpack.Configuration}
 */
const getWebpackConfig = (env, doMinify) => {
	/** @type {webpack.Configuration} */
	const config = {
		devtool: env.development ? 'source-map' : false,
		entry: {
			[doMinify ? 'emoji-utils.min' : 'emoji-utils']: ['./src/emojis-utils.js'],
		},
		mode: env.development ? 'development' : 'production',
		output: {
			filename: '[name].js',
		},
		plugins: [
			new CleanWebpackPlugin(),
			new CopyWebpackPlugin({
				patterns: [{ from: './src/emojis-utils.d.ts', to: 'emojis-utils.d.ts' }],
			}),
		],
		resolve: {
			extensions: ['.js', '.json'],
		},
		watch: !!(env.development && env.watch),
		watchOptions: {
			aggregateTimeout: 1000,
			ignored: /node_modules/,
			poll: 1000,
		},
	};
	if (!doMinify) {
		config.optimization = {
			minimize: false,
		};
	}
	return config;
};

module.exports = [
	/**
	 * @param {Environment} env
	 * @returns {webpack.Configuration}
	 */
	(env) => getWebpackConfig(env, true),
	/**
	 * @param {Environment} env
	 * @returns {webpack.Configuration}
	 */
	(env) => getWebpackConfig(env, false),
];
