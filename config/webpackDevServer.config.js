'use strict';

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerminalLogPlugin = require("./webpack/TerminalLogPlugin");
const alias = require("./alias");
const packageJson = require("./../package.json");

const SCRIPT_REG = /\.(ts|js)x?$/
const STYLE_REG = /\.css$/i

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: HOST,
    port: PORT,
    hot: true,
  },
  module: {
    rules: [
      {
        test: SCRIPT_REG,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
      {
        test: STYLE_REG,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    alias: { ...alias },
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html')
    }),
    new TerminalLogPlugin({ 
      message: `dev server running on http://${HOST}:${PORT}`,
      name: packageJson.name
    })
  ],
  output: {
    filename: "bundle.[fullhash].js",
    path: path.resolve(__dirname, '..', './build')
  }
}