var gulp = require('gulp'),
  gutil = require('gulp-util'),
  clean = require('gulp-rimraf'),
  bundle = require('gulp-bundle-assets'),
  srcClientPath = './src/client',
  srcSrvPath = './src/server',
  publicPath = './public',
  options = {
    paths: {
      lint: [
          srcSrvPath + '/**/*.js'
      ],
      felint: [
          srcClientPath + '/**/*.js'
      ],
      cover: [
          srcSrvPath + '/**/*.js'
      ],
      test: [
        './test/**/*.js'
      ]
    }
  };

require('load-common-gulp-tasks')(gulp, options);

gulp.task('develop', 'Watch and restart server on change', ['build', 'watch'], function () {
  var nodemon = require('gulp-nodemon');
  nodemon({
    script: srcSrvPath + '/index.js',
    ext: 'html js',
    ignore: ['bower_components/*', 'node_modules/*', publicPath + '/*', srcClientPath + '/*']
  })
    .on('change', ['ci-watch'])
    .on('restart', function () {
      var d = new Date();
      console.log(gutil.colors.bgBlue('server restarted at ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()));
    });
});

gulp.task('clean', 'Clean all assets out of /public', function () {
  return gulp.src([publicPath + '/*'], {read: false})
    .pipe(clean());
});

gulp.task('watch', 'Watch assets and build on change', function () {
  var livereload = require('gulp-livereload'),
    server = livereload();
  gulp.watch([srcClientPath + '/**/*.*'], ['build']);
  gulp.watch([publicPath + '/**/*.*']).on('change', function (file) {
    server.changed(file.path);
  });
});

gulp.task('bundle', 'Builds all static files', ['clean'], function () {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results({
      dest: './',
      pathPrefix: '/public/'
    }))
    .pipe(gulp.dest(publicPath));
});
