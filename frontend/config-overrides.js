// config-overrides.js
const path = require('path');
const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    // Webpack extra entry
    entry: 'src/index.js',
    // HTML template used in plugin HtmlWebpackPlugin
    template: 'public/index.html',
    // The file to write the HTML to. You can specify a subdirectory
    // outPath: '/entry/standard.html'
    // Visit: http[s]://localhost:3000/entry/standard.html
  },
  {
    entry: 'src/login.js',
    // if [template] is empty, Default value: `public/index.html`
    template: 'public/login.html',
    outPath: 'login.html'
    // Visit: http[s]://localhost:3000/public/login.html
  },
]);
// const addRewireScssLoader = require("react-app-rewire-scss-loaders");
// const SassRuleRewirer = require('react-app-rewire-sass-rule');
// const rewireSass = require('react-app-rewire-sass');
const rewireSass = require ( 'react-app-rewire-sass-modules'); 
const { override, addWebpackModuleRule, adjustStyleLoaders } = require('customize-cra');
//https://github.com/arackaf/customize-cra
module.exports = {
  webpack: override(
    function(config, env) {
      multipleEntry.addMultiEntry(config);
      return config;
    },
    addWebpackModuleRule(
      { 
        test : /\.(css|scss)$/,  
        use :[
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            }
          },
          {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                postcssNormalize(),
              ],
              sourceMap: true
            },
          },
          {                
            loader: require.resolve("sass-loader"),                
            options: {         
              sourceMap: true                
            }              
          }
        ]
      } 
    ),
    adjustStyleLoaders((loader) => {
      console.log(loader)
    })
  )
};