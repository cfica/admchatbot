var path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
});

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', {'plugins': ['@babel/plugin-proposal-class-properties']}]
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      {
         test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
         exclude: /node_modules/,
         use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
     }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    }),
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    publicPath: '/',
    compress: true,
    public: 'app-v1.acyr.cl',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
}
