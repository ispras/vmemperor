/**
 * COMMON WEBPACK CONFIGURATION
 */


const path = require('path');
const webpack = require('webpack');
const getTransformer = require('ts-transform-graphql-tag').getTransformer;

//const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
//const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const SentryCliPlugin = require('@sentry/webpack-plugin');


// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

module.exports = (options) => ({
  node: {
    fs: 'empty',
  },
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    rules: [
      {
      test: /\.(ts|tsx)$/,
      use: [
        'babel-loader',
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({before: [getTransformer()]})
          }
        }
      ],
        exclude: [/node_modules/],
      },
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        //exclude: /node_modules/,
        exclude: /node_modules[\\/](?!@av).*/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
        'style-loader',
        {
          loader: 'typings-for-css-modules-loader',
          options: {
            modules: true,
            namedExport: true
          }
        }
      ]
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
       {
         test: /\.(graphql|gql)$/,
         exclude: /node_modules/,
         loader: 'graphql-tag/loader'
       },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    /*new SentryCliPlugin({
      include: '.',
      release: process.env.REL,
      ignoreFile: '.sentrycliignore',
      configFile: 'sentry.properties',
      ignore: ['webpack', 'node_modules'],
    }), */
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),

  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
      '.ts',
      '.tsx',
    ],
    mainFields: [
      'browser',
      'main',
      'jsnext:main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
