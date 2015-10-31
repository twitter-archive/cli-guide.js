var gulp       = require('gulp'),
    jsmin      = require('gulp-jsmin'),
    rename     = require('gulp-rename'),
    minifyCss  = require('gulp-minify-css'),
    jshint     = require('gulp-jshint'),
    uglify     = require('gulp-uglify'),
    paths = {
        scripts: 'src/*.js',
        styles: 'src/*.css',
        fonts: '*.{ttf, otf}',
        res: ['package.json','README.md','LICENSE','nano.gif','terminal.gif']
    };

gulp.task('publish', function() {
  return gulp.src(paths.res)
         .pipe(gulp.dest('dist'));
});

gulp.task('copy-original-files', function() {
  return gulp.src([paths.scripts, paths.styles, paths.fonts])
         .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
  return gulp.src(paths.styles)
         .pipe(minifyCss())
         .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src([paths.scripts])
         .pipe(jshint())
         .pipe(jshint.reporter('default'));
});

gulp.task('compress-js', function() {
  return gulp.src(paths.scripts)
         .pipe(uglify())
         .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest('dist'))
});

gulp.task('default', ['minify-css', 'lint', 'compress-js', 'copy-original-files', 'publish']);
