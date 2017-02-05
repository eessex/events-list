var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('bundle', function() {
  return browserify('src/router.js')
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('static/'));
});

gulp.task('watch', function() {
  var b = browserify({
    entries: ['src/router.js'],
    cache: {}, packageCache: {},
    plugin: ['watchify']
  });

  b.on('update', makeBundle);

  function makeBundle() {
    b.transform('babelify', {presets: ['es2015', 'react']})
      .bundle()
      .on('error', function(err) {
        console.error(err.message)
        console.error(err.codeFrame);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('static/'));
    console.log('Succesfully updated bundle.')
  }

  makeBundle();

  return b;
});

gulp.task('default', ['watch']);