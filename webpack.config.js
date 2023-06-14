var path = require("path")
const webpack = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const PROD = JSON.parse(process.env.PROD_ENV == "1")
console.log(PROD)

module.exports = {
  mode: "production",
  node: {
    global: true,
  },
  entry: "./index.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: PROD ? "bundle.min.js" : "bundle.js",
    library: ["aesgcm"],
  },
  optimization: {
    minimize: PROD,
    minimizer: [new TerserPlugin({ parallel: true })],
    usedExports: true,
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    // new webpack.ProvidePlugin({
    //   process: "process/browser",
    // }),
  ],
  resolve: {
    fallback: {
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("browserify-cipher"),
    },
  },
}
