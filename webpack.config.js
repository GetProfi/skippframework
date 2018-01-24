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
    react: "react",
    redux: "redux",
    lodash: "lodash"
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".jsx"]
  }
};
