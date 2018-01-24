module.exports = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js",
    library: "library",
    libraryTarget: "commonjs2"
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: [
            [
              "env",
              {
                browsers: ["last 2 versions", "safari >= 7", "IE11"]
              }
            ],
            "react"
          ],
          plugins: [
            [
              "transform-object-rest-spread",
              {
                useBuiltIns: true
              }
            ],
            "transform-class-properties"
          ]
        }
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  externals: {
    'react': {
      'commonjs': 'react',
      'commonjs2': 'react',
      'amd': 'react',
      'root': 'React'
    },
    'react-dom': {
      'commonjs': 'react-dom',
      'commonjs2': 'react-dom',
      'amd': 'react-dom',
      'root': 'ReactDOM'
    }
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".jsx"]
  }
};
