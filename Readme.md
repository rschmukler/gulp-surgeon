# Gulp-surgeon

Surgical precision for Gulp

## What it does

Surgeon works much like gulp-concat. The difference is, that in addition to concatinating the files, it adds a signature to their source file. 
This allows it to later modify the destination file without having to read and recompile all of the other files. 

## Example Usage

```js
var stylPaths = ['lib/**/*.styl'];
gulp.task('styles', function() {
  gulp.src(stylPaths)
    .pipe(stylus)
    .pipe(surgeon.stitch('app.css'))
    .pipe(gulp.dest('public/'));
}

gulp.watch(stylPaths), function(event) {
  gulp.src(event.path)
    .pipe(stylus)
    .pipe(surgeon.slice('public/app.css'))
    .pipe(gulp.dest('public/'));
});
```
