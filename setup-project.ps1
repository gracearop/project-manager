# --- Create necessary folders ---
New-Item -ItemType Directory -Force -Path "src" | Out-Null
New-Item -ItemType Directory -Force -Path "public" | Out-Null

# --- Create index.html (Vite + Webpack compatible) ---
@"
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project Manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
"@ | Set-Content "index.html"

# --- Create Tailwind config ---
@"
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
"@ | Set-Content "tailwind.config.js"

# --- Create PostCSS config ---
@"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"@ | Set-Content "postcss.config.js"

# --- Create Babel config ---
@"
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
"@ | Set-Content ".babelrc"

# --- Create Webpack Common ---
@"
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.(png|jpe?g|gif|svg)$/i, type: 'asset' }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
};
"@ | Set-Content "webpack.common.js"

# --- Create Webpack Dev ---
@"
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: {
    static: path.join(__dirname, 'public'),
    hot: true,
    historyApiFallback: true,
    port: 3000,
  },
});
"@ | Set-Content "webpack.dev.js"

# --- Create Webpack Prod ---
@"
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'styles/[name].[contenthash:8].css' })],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
  },
});
"@ | Set-Content "webpack.prod.js"

# --- Create Vite Config ---
@"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    port: 3000
  }
});
"@ | Set-Content "vite.config.js"

# --- Create Example src/index.jsx ---
@"
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
"@ | Set-Content "src/index.jsx"

# --- Create Example src/App.jsx ---
@"
export default function App() {
  return (
    <div className='p-8 text-2xl font-bold text-blue-600'>
      Project Manager App Ready ✔
    </div>
  );
}
"@ | Set-Content "src/App.jsx"

# --- Create Tailwind index.css ---
@"
@tailwind base;
@tailwind components;
@tailwind utilities;

@import 'flowbite/dist/flowbite.css';
"@ | Set-Content "src/index.css"

Write-Host "`nAll config files created successfully! 🚀"
