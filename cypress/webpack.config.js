const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				loader: 'ts-loader',
				options: {
					// disable type checking here and run it separtely w/ ForkTsCheckerWebpackPlugin
					transpileOnly: true,
				},
			},
		],
	},
	plugins: [new ForkTsCheckerWebpackPlugin()],
};
