var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

gulp.task('minify-css', function() {
  return gulp.src('src/*.css')
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    gulp.src('src/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['minify-css', 'js']);
