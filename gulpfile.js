let gulp = require('gulp'),
  sass = require('gulp-dart-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('gulp-cssnano'),
  dependents = require('gulp-dependents'),
  minify = require('gulp-minify'); // for js
const paths = {
  scss: {
    src: './scss/*.scss',
    dest: './css',
    watch: './scss/**/*.scss',
  },
  js: {
    bulmajs: 'node_modules/@vizuaalog/bulmajs/dist/bulma.js',
    drulmajs: 'src/drulma_js/*.js',
    dest: './js'
  }
}

const autoprefixer_options = {
  browsers: [
    'Chrome >= 35',
    'Firefox >= 38',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 8',
    'Safari >= 8',
    'Android 2.3',
    'Android >= 4',
    'Opera >= 12'
  ]
}

// Compile sass into CSS & auto-inject into browsers
function styles(cb) {
  return gulp.src([paths.scss.src, paths.scss.watch], { since: gulp.lastRun(styles) })
    .pipe(dependents())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano()) // minify CSS
    .pipe(postcss([require('autoprefixer')(autoprefixer_options)]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .on('end', cb)
}

// Move the javascript files into our js folder
function js() {
  return gulp.src([paths.js.bulmajs])
    .pipe(cached('sasscache'))
    .pipe(gulp.dest(paths.js.dest))
}

// Static Server + watching scss/html files
function serve() {
  gulp.watch([paths.scss.watch], styles)
}

const build = gulp.series(gulp.parallel(styles, serve))

exports.styles = styles
exports.js = js
exports.serve = serve
exports.default = build
