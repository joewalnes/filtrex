module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    browsers: ['Chrome'],
    reporters: ['mocha'],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    files: [
      'filtrex.js',
      'test/**/*-test.js'
    ]
  });
};