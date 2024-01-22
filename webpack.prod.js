const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { csvRule } = require('./webpack.rules.js');

const merged = mergeWithRules({
	module: {
		rules: 'replace'
	}
})(common, {
	mode: 'production',
	// plugins: [new BundleAnalyzer()],
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(s?)css$/i,
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
											preset: 'default'
										}
									],
									require('postcss-import'),
									require('autoprefixer')
								]
							}
						}
					},
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
								],
								[
									'transform-imports',
									{
										lodash: {
											transform: 'lodash/${member}',
											preventFullImport: true
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
