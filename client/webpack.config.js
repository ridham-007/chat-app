const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    // Where files should be sent once they are bundled
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.bundle.js',
        publicPath: '/',
    },
    // webpack 5 comes with devServer which loads in development mode
    devServer: {
        port: 3000,
        historyApiFallback: true,
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components'),
            react: path.resolve('./node_modules/react'),
        },
        extensions: ['.js', '.jsx'],
    },
    // Rules of how webpack will take our files, complie & bundle them for the browser 
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /nodeModules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}