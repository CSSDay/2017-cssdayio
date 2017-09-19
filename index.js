const path = require('path');
const fs = require('fs');
const pug = require('pug');
const postcss = require('postcss');
const babel = require('babel-core');

const dir = './public';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// compile pug
pug.renderFile(
  path.join(__dirname, 'source/index.pug'),
  { basedir: path.join(__dirname, 'source'), filename: path.join(__dirname, 'source/index.pug') },
  (err, result) => {
    fs.writeFile(path.join(__dirname, 'public/index.html'), result, err => {
      if (err) console.log(err); // eslint-disable-line
    });
  }
);

// process css
const plugs = [
  require('postcss-import'),
  require('postcss-nested'),
  require('postcss-custom-media'),
  require('postcss-focus'),
  require('autoprefixer'),
  require('cssnano'),
  require('css-mqpacker'),
];

fs.readFile(path.join(__dirname, 'source/css/index.css'), (err, css) => {
  postcss(plugs)
    .process(css, { from: 'source/css/index.css', to: 'public/bundle.css' })
    .then(result => {
      fs.writeFile(path.join(__dirname, 'public/bundle.css'), result.css, err => {
        if (err) console.log(err); // eslint-disable-line
      });
      if (result.map)
        fs.writeFile(path.join(__dirname, 'public/bundle.css.map'), result.map, err => {
          if (err) console.log(err); // eslint-disable-line
        });
    })
    .catch(err => {
      if (err) console.log(err); // eslint-disable-line
    });
});

// process js
babel.transformFile(path.join(__dirname, 'source/js/index.js'), (err, result) => {
  fs.writeFile(path.join(__dirname, 'public/bundle.js'), result.code, err => {
    if (err) console.log(err); // eslint-disable-line
  });
  if (result.map)
    fs.writeFile(path.join(__dirname, 'public/bundle.js.map'), result.map, err => {
      if (err) console.log(err); // eslint-disable-line
    });
});
