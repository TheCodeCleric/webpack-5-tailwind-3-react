const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentContext: path.resolve(__dirname, 'src'),
      getLocalIdent: (
        { resourcePath },
        localIdentName,
        localName,
        { context }
      ) => {
        let result = resourcePath
          .replace(context, '')
          .slice(1)
          .replace('/', '-');
        return `${result.slice(0, result.indexOf('.'))}__${localName}`;
      },
    },
    importLoaders: 1,
  },
};

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: 'global',
    importLoaders: 1,
  },
};

// Our PostCSSLoader
const PostCSSLoader = {
  loader: 'postcss-loader',
  options: {},
};

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  devServer: {
    port: 3030,
    static: path.join(__dirname, 'public'),
    historyApiFallback: true,
  },
  devtool: 'source-map',
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: [path.resolve(__dirname, 'src/index.css'), /\.module.css$/],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/index.css'),
        use: [MiniCssExtractPlugin.loader, CSSLoader, PostCSSLoader],
      },
      {
        test: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, CSSModuleLoader, PostCSSLoader],
      },
      {
        test: /\.svg$/i,
        oneOf: [
          {
            issuer: /\.[jt]sx?$/,
            resourceQuery: /react/,
            use: ['@svgr/webpack'],
          },
          {
            type: 'asset/resource',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new DotenvPlugin(),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/assets'),
          to: path.resolve(__dirname, 'build/assets'),
        },
      ],
    }),
  ],
};
