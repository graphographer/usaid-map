const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common.js');
const purgeCss = require('@fullhuman/postcss-purgecss');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ARRAY_COLUMNS = ['country', 'level of education', 'setting', 'skills'];

const merged = mergeWithRules({
	module: {
		rules: 'replace'
	}
})(common, {
	mode: 'production',
	plugins: [new BundleAnalyzer()],
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /leaflet\.css/,
				use: [
					{ loader: 'css-loader', options: { sourceMap: true } },
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								plugins: [
									[
										'cssnano',
										{
											preset: ['advanced']
										}
									],
									require('postcss-import'),
									require('autoprefixer')
								]
							}
						}
					}
				]
			},
			{
				test: /leaflet\.css/,
				use: [
					{ loader: 'css-loader', options: { sourceMap: true } },
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								plugins: [
									[
										'cssnano',
										{
											preset: ['advanced']
										}
									],
									require('postcss-import'),
									require('autoprefixer')
								]
							}
						}
					}
				]
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
							return data.split('\n').map(val => val.trim());
						}

						return data.trim();
					}
				}
			},
			// all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
			{
				test: /\.([cm]?ts|tsx)$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								[
									'template-html-minifier',
									{
										modules: {
											'lit-html': ['html'],
											lit: ['html', { name: 'css', encapsulation: 'style' }]
										},
										strictCSS: true,
										htmlMinifier: {
											collapseWhitespace: true,
											conservativeCollapse: true,
											removeComments: true,
											caseSensitive: true,
											minifyCSS: true
										}
									}
								]
							]
						}
					},
					{
						loader: 'ts-loader'
					}
				]
			}
		]
	}
});

module.exports = merged;
