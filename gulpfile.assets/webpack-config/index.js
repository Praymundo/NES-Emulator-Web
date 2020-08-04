import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export function getConfig() {
	return {
		mode: false ? 'development' : 'production',
		devtool: false ? 'inline-source-map' : 'source-map',
		output: {
			filename: 'nes-emulator.js'
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve('./', 'src', 'index.html')
			})
		],
		performance: { hints: false },
		optimization: {
			minimize: true,
			minimizer: [
				new TerserJSPlugin({
					cache: true,
					parallel: true,
					sourceMap: true,
					extractComments: false,
					terserOptions: {
						output: {
							comments: false
						}
					}
				}),
				new OptimizeCSSAssetsPlugin()
			]
		},
		externals: {
			lodash: ['self', '_'],
			vue: ['self', 'Vue']
		},
		resolve: {
			alias: {
				lodash: path.resolve('./src/assets/lib/lodash/lodash.min.js'),
				vue: path.resolve('./src/assets/lib/vue/Vue.js')
			}
		},
		module: {
			noParse: (content) => /(Vue(\.min)?\.js|lodash(\.min)?\.js)$/.test(content),
			rules: [
				{
					test: /\.js$/,
					include: path.resolve('./', 'src'),
					exclude: /(node_modules|bower_componets)/,
					use: [
						'cache-loader',
						{
							loader: 'babel-loader',
							options: {
								//cacheDirectory: true,
								presets: ['@babel/preset-env'],
								plugins: ['@babel/plugin-proposal-class-properties'],
								compact: false
							}
						}
					]
				},
				{
					test: /\.(sc|sa|c)ss$/,
					include: path.resolve('./', 'src'),
					exclude: /(node_modules|bower_componets)/,
					use: [
						'cache-loader',
						{
							loader: 'style-loader',
							options: {
								insert: function insertAtTop(element) {
									var parent = self.document.querySelector('head');
									var lastInsertedElement = self._lastElementInsertedByStyleLoader;
									if (!lastInsertedElement) {
										parent.insertBefore(element, parent.firstChild);
									} else if (lastInsertedElement.nextSibling) {
										parent.insertBefore(element, lastInsertedElement.nextSibling);
									} else {
										parent.appendChild(element);
									}
									self._lastElementInsertedByStyleLoader = element;
								}
							}
						},
						{ loader: 'css-loader' },
						{ loader: 'sass-loader' }
					]
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					include: path.resolve('./', 'src'),
					exclude: /(node_modules|bower_componets)/,
					use: [
						'cache-loader',
						{
							loader: 'url-loader'
						}
					]
				}
			]
		}
	};
}
