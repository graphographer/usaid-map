const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = mergeWithRules({
	plugins: 'replace'
})(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
		compress: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Development',
			template: 'src/index.html'
		}),
		new BundleAnalyzer()
	],
	optimization: {
		runtimeChunk: 'single'
	}
});
