// This is to test index.js bundle file generated using webpack
// one can run this by 'node ./test_webpack_output_index.js'

const index =  require('./dist/index.js');
(async() => {
  index.handler();
})();
