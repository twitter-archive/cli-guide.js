var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    runSequence   = require('run-sequence'),
    rename        = require('gulp-rename'),
    minifyCss     = require('gulp-minify-css'),
    jshint        = require('gulp-jshint'),
    uglify        = require('gulp-uglify'),
    del           = require('del'),
    express       = require('express'),
    browserSync   = require('browser-sync');

var server;

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return gutil.noop();
}

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('publish', function() {
  return gulp.src(['package.json','README.md','LICENSE','nano.gif','terminal.gif'])
         .pipe(gulp.dest('dist'));
});

gulp.task('copy-original-files', function() {
  return gulp.src('src/*.{css,js,ttf,otf}')
         .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
  return gulp.src('src/*.css')
         .pipe(minifyCss())
         .pipe(gulp.dest('dist'))
         .pipe(reload());
});

gulp.task('lint', function() {
  return gulp.src(['src/*.js'])
         .pipe(jshint())
         .pipe(jshint.reporter('default'));
});

gulp.task('minify-js', function() {
  return gulp.src('src/*.js')
         .pipe(uglify())
         .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest('dist'))
         .pipe(reload());
});

gulp.task('server', function() {
  server = express();
  server.use(express.static('./'));
  server.listen(3000);
  browserSync({ proxy: 'localhost:3000' });
});

gulp.task('build', function(){
  runSequence('clean',['minify-css', 'lint', 'minify-js', 'copy-original-files', 'publish']);
});

gulp.task('watch', function() {
  gulp.watch(['./src/*'], ['minify-js','minify-css']);
});

gulp.task('default', ['build', 'watch', 'server']);
