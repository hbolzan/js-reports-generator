module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }

        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        static: './dist',
        proxy: [
            {
                context: ["/version"],
                target: "http://localhost:8080",
                router: () => "http://127.0.0.1:3000",
            },
            {
                context: ["/api"],
                target: "http://localhost:8080",
                router: () => "http://127.0.0.1:3000",
            },
            {
                context: ["/auth"],
                target: "http://localhost:8080",
                router: () => "http://127.0.0.1:3000",
            },
        ]
    }
};
