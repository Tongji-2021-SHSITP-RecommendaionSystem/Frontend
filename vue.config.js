const webpack = require("webpack");
module.exports = {
	configureWebpack: {
		devtool: "source-map",
		plugins: [
			new webpack.ProvidePlugin({
				$: "jquery",
				jquery: "jquery",
				"window.jQuery": "jquery",
				jQuery: "jquery",
			}),
		],
	},
};
