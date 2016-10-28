var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('watch',function() {
    gulp.watch('src/scss/*.scss',['sass']);
});

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/css'));
});
