const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { csvRule } = require('./webpack.rules.js');

module.exports = {
	mode: 'production',
	entry: './src/app/index.ts',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Production',
			template: 'src/index.html'
		})
	],
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.ts', '.tsx', '.js', '.css'],
		// Add support for TypeScripts fully qualified ESM imports.
		extensionAlias: {
			'.js': ['.js', '.ts'],
			'.cjs': ['.cjs', '.cts'],
			'.mjs': ['.mjs', '.mts']
		}
	},
	module: {
		rules: [
			{
				test: /\.(s?)css$/i,
				use: [
					{ loader: 'css-loader' },
					{
						loader: 'sass-loader',
						options: {
							implementation: require('dart-sass')
						}
					}
				]
			},
			csvRule,
			// all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
			{ test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' }
		]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
};
