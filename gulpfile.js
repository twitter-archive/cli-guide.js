var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    header        = require('gulp-header'),
    concat        = require('gulp-concat'),
    runSequence   = require('run-sequence'),
    rename        = require('gulp-rename'),
    minifyCss     = require('gulp-minify-css'),
    jshint        = require('gulp-jshint'),
    uglify        = require('gulp-uglify'),
    del           = require('del'),
    express       = require('express'),
    browserSync   = require('browser-sync'),
    paths = {
        dist: './dist/',
        styles: './src/*.css',
        fonts: './src/*.{ttf,otf}',
        res: ['LICENSE','package.json'],
        template: './templates/**',
        scripts: ['./src/head.js','./src/init_var.js','./src/util.js','./src/parsejson.js','./src/step.js','./src/cli.js',
                  './src/utilregexp.js','./src/modal.js','./src/commandvalidation.js','./src/functions.js',
                  './src/nano.js','./src/nano_events.js','./src/file.js','./src/events.js','./src/defaults.js',
                  './src/init.js','./src/foot.js']
    };

var about =  "/*  \n"   +
              " * cli_guide plugin \n"  +
              " * Original author: @willrre \n"  +
              " * Further changes, comments: @willrre \n"  +
              " * Licensed under the MIT license \n"  +
              " */\n\n";

var server;

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return gutil.noop();
}

gulp.task('clean', function() {
  return del([paths.dist]);
});

gulp.task('publish', function() {
  return gulp.src(paths.res)
         .pipe(gulp.dest(paths.dist));
});

gulp.task('copy-fonts', function() {
  return gulp.src([paths.fonts])
         .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
         .pipe(minifyCss())
         .pipe(gulp.dest(paths.dist))
         .pipe(reload());
});

/*gulp.task('lint', function() {
  return gulp.src(['./src/head.js','./src/init_var.js'])
         .pipe(jshint())
         .pipe(jshint.reporter('default'));
});*/

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
         .pipe(concat('cli_guide.js'))
         .pipe(gulp.dest(paths.dist))
         .pipe(uglify())
         .pipe(rename({suffix: '.min'}))
         .pipe(header(about))
         .pipe(gulp.dest(paths.dist))
         .pipe(reload());
});

gulp.task('server', function() {
  server = express();
  server.use(express.static('./'));
  server.listen(3000);
  browserSync({ proxy: 'localhost:3000' });
});

gulp.task('build', function(){
  runSequence('clean',['styles', 'scripts', 'copy-fonts', 'publish']);
});

gulp.task('watch', function() {
  gulp.watch(['./src/*.js'], ['scripts']);
  gulp.watch(['./src/*.css'], ['styles']);
});

gulp.task('default', ['build']);

gulp.task('develop', ['build', 'watch', 'server']);
