const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const http = path.resolve(__dirname, "node_modules/stream-http/index.js");

module.exports = {
  resolve: {
    alias: { http, https: http },
  },
  mode: "development",
  target: "web",
  context: __dirname + "/src",
  entry: {
    "./components/config": "./components/config.ts",
    "./module": "./module.ts",
    "./panels/import-json-panel/module": "./panels/import-json-panel/module.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "amd",
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    "lodash", "remarkable", "jquery", "angular",
    function(context, request, callback) {
      var prefix = "grafana/";
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    },
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      {from: "**/plugin.json"},
      {from: "**/*.html"},
      {from: "dashboards/*"},
      {from: "../README.md"},
      {from: "**/img/**"},
    ]),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "dist")],
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: "babel-loader",
            options: {presets: ["@babel/preset-env"]},
          },
          "ts-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
        },
      },
      {
        test: /\.js$/,
        exclude: /(external)/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
