module.exports = {
	module: {
		rules: [{
			include: [/node_modules\/d3/],
			sideEffects: true,
		}]
	},
	node: { global: true, fs: 'empty' },
	output: {
		filename: '[name].[contentHash].js',
		chunkFilename: '[name].[contentHash].js',
	},
	optimization: {
		moduleIds: 'hashed',
		namedChunks: true,
		chunkIds: 'named',
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 2,
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					chunks: 'all',
				},
			},
		},
	},
}
