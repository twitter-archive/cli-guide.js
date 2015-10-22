var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    minifyCss  = require('gulp-minify-css'),
    jshint     = require('gulp-jshint'),
    uglify     = require('gulp-uglify');

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
         .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src(['src/*.js'])
         .pipe(jshint())
         .pipe(jshint.reporter('default'));
});

gulp.task('compress-js', function() {
  return gulp.src('src/*.js')
         .pipe(uglify())
         .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest('dist'))
});

gulp.task('default', ['minify-css', 'lint', 'compress-js', 'copy-original-files', 'publish']);
