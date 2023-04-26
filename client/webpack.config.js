const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PROD = require('minimist')(process.argv).env === 'prod';

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, '../server/static'),
		filename: 'bundle.[chunkhash].js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /.(jsx?)$/,
				use: 'babel-loader',
			},
			{
				enforce: 'pre',
				test: /.js$/,
				loader: 'source-map-loader',
			},
			{
				test: /.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: {
								localIdentName: PROD ? '[hash:base64:6]' : '[path][name]__[local]',
							},
						},
					},
					'sass-loader',
				],
			},
		],
	},
	mode: PROD ? 'production' : 'development',
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		})
	],
	optimization: {
		minimize: true
	},
	devServer: {
		historyApiFallback: true,
	},
	devtool: PROD ? '' : 'source-map',
	resolve: {
		extensions: ['.js', '.jsx'],
	},
};
	
