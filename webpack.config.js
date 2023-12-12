const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ARRAY_COLUMNS = ['country', 'level of education', 'setting', 'skills'];

module.exports = {
	mode: 'development',
	entry: './src/app/index.mts',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist'
	},
	module: {
		rules: [
			{
				test: /\.csv$/,
				loader: 'csv-loader',
				options: {
					header: true,
					skipFirstNLines: 3,
					skipEmptyLines: 'greedy',
					transformHeader(header) {
						return header.trim();
					},
					transform(data, header) {
						if (ARRAY_COLUMNS.includes(header.toLowerCase())) {
							return data.split('\n').map(val => val.trim());
						}

						return data;
					}
				}
			},
			{
				test: /\.m?ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Development'
		})
	],
	resolve: {
		extensions: ['.mts', '.ts', '.js']
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		runtimeChunk: 'single'
	}
};
