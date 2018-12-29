const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		polly: 'babel-polyfill',
		app: './src/app/index.js'
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'worldforge',
			template: __dirname + "/src/app/index.html"
		})
	],
	output: {
		filename: 'bundle.js',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	resolve: {
		alias: {
			'parchment': path.resolve(__dirname, 'node_modules/parchment/src/parchment.ts'),
			'quill$': path.resolve(__dirname, 'node_modules/quill/quill.js'),
		},
		extensions: ['.js', '.ts', '.svg']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						"presets": [
							[
								"@babel/preset-env",
								{
									"targets": "> 0.25%, not dead"
								}
							],
							"@babel/react"
						],
						"plugins": [
							"@babel/plugin-proposal-class-properties"
						]
					}
				}
			},
			{
				test: /\.ts$/,
				use: [{
					loader: 'ts-loader',
					options: {
						compilerOptions: {
							declaration: false,
							target: 'es5',
							module: 'commonjs'
						},
						transpileOnly: true
					}
				}]
			},
			{
				test: /\.svg$/,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};