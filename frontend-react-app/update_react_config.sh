sed -i "s/resolveApp(buildPath)/resolveApp(\'..\/static\/react\')/1" config/paths.js
sed -i 's/static\///g' config/webpack.config.js
sed -i 's/template: paths.appHtml,/template: paths.appHtml, filename: \"..\/..\/templates\/index.html\"/1' config/webpack.config.js
sed -i 's/"homepage": "\/"/"homepage": "https:\/\/my-weight-pal-374215.uk.r.appspot.com\/static\/react"/1' package.json