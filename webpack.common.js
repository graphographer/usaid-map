const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ARRAY_COLUMNS = [
	'country',
	'level of education',
	'setting',
	'skills',
	'common skills'
];

module.exports = {
	mode: 'production',
	entry: './src/app/index.ts',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Production',
			template: 'src/template.html'
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
				test: /\.css$/,
				loader: 'css-loader'
			},
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
						// if (!header.trim() || !data.trim()) return undefined;

						if (ARRAY_COLUMNS.includes(header.toLowerCase())) {
							return [...new Set(data.split('\n').map(val => val.trim()))];
						}

						return data.trim();
					}
				}
			},
			// all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
			{ test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' }
		]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
};
