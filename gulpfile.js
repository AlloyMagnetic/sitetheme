let gulp = require('gulp'),
  sass = require('gulp-dart-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('gulp-cssnano'),
  minify = require('gulp-minify'); // for js
const paths = {
  scss: {
    src: './scss/style.scss',
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
function styles() {
  return gulp.src([paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano()) // minify CSS
    .pipe(postcss([require('autoprefixer')(autoprefixer_options)]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
}

// Move the javascript files into our js folder
function js() {
  return gulp.src([paths.js.bulmajs, paths.js.drulmajs])

    .pipe(minify({ ext: { min: '.min.js' }, noSource: true }))
    .pipe(gulp.dest(paths.js.dest))
}

// Static Server + watching scss/html files
function serve() {
  gulp.watch([paths.scss.watch], styles)
}

const build = gulp.series(styles, gulp.parallel(js, serve))

exports.styles = styles
exports.js = js
exports.serve = serve
exports.default = build
