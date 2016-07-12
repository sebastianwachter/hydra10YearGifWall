'use strict';

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),

    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    combineMediaQueries = require('gulp-combine-media-queries');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// default task
gulp.task('default', ['serve']);

// build css from sass
gulp.task('build-css', () => {
  return gulp.src('source/scss/*.scss')
    .pipe(sass())
    //.pipe(combineMediaQueries)
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('public/styles/'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'CSS task complete' }));
});

// minify & uglify js
gulp.task('build-js', () => {
  return gulp.src('source/javascript/*.js')
    .pipe(concat('script.js'))
    // uglify if gulp --type production
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(gulp.dest('public/scripts/'))
    .pipe(notify({ message: 'JavaScript task complete' }));
});

// browser-sync server task - reload after building minified js and css
gulp.task('serve', ['build-js', 'build-css'], () => {

  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  gulp.watch('source/javascript/*.js', ['build-js', reload]);
  gulp.watch('source/scss/*.scss', ['build-css']);
  gulp.watch('public/*.html', reload);
});
