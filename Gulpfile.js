var fs = require('fs')

var gulp = require("gulp"),
    _ = require("lodash"),
    // Utils
    clean  = require('gulp-clean'),
    rename = require("gulp-rename"),
    filter = require("gulp-filter"),
    notify = require("gulp-notify"),
    merge  = require("merge-stream"),
    replace = require("gulp-replace"),
    path   = require("path"),
    debug = require('gulp-debug'),
    merge = require('merge2'),

    // Transformers
    sass = require("gulp-ruby-sass"),
    vulcanize = require("gulp-vulcanize"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    minifyCSS = require("gulp-minify-css"),
    livereload = require('gulp-livereload'),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require('gulp-sourcemaps'),
    watch = gulp.watch.bind(gulp),
    to5 = require('gulp-babel')

// not convinced using a paths object is valuable,
// there are many unique situations and not a whole lot of duplication
var paths = {
  html:    ["app/**/*.html", "!app/vendor/**"],
  scripts: ["app/**/*.js", "!app/vendor/**"],
  css:     ["app/**/*.css", "!app/vendor/**"],
  sass:    ["app/**/*.scss", "!app/vendor/**"],
  sass_load_paths: ['app/vendor', 'app/styles'],
  styles_watched: ["app/**/*.scss", "app/**/*.css"],
  misc_copy: [
    "app/images/**",
    "app/polyfills/fonts/**",
    "app/data.sample.json",
    "app/vendor/**"
  ],
  index: "app/index.html",
  build:   "dist"
}

var watchOpts = { interval: 500 }
var to5Opts = { modules: 'amd' }

function htmlStream(src) {
  return src
    // Currently polymer is really not helpful with shiming shadow dom in
    // index.html, gotta inline index.css
    .pipe(replace('<link rel="stylesheet" href="styles/index.css">', function(s) {
        var style = fs.readFileSync(paths.build+'/styles/index.css', 'utf8')
        return '<link rel="import" href="vendor/polymer/polymer.html">\n<style is="custom-style">\n' + style + '\n</style>\n'
    }))
}

// Scripts does both html and scripts as they need to share the to5 step
// to share the same js module space
gulp.task("scripts", function() {
  var src = paths.scripts
  src = src.concat(paths.html)
  return htmlStream(gulp.src(src))
    .pipe(to5(to5Opts))
    .on("error", notify.onError("[Scripts] <%= error.message%>"))
    .pipe(livereload())
    .pipe(gulp.dest(paths.build))
})

gulp.task("styles", function() {
  var css = gulp.src(paths.css)
  var scss = sass( 'app', {
      loadPath: paths.sass_load_paths,
      // debugInfo: true,
      // trace: true
    })
    .on('error', function (err) {
      console.error('SASS Error', err.message);
   })

  return merge(css, scss)
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.build))
    .on("error", function (err) {
      console.error('SASS Error', err);
    })
    .pipe(livereload())
    .pipe(gulp.dest(paths.build))
})

gulp.task("copy", function() {
  return gulp.src(paths.misc_copy, {base: 'app/'})
    .pipe(livereload())
    .pipe(gulp.dest(paths.build))
})

gulp.task("build", ["styles", "scripts", /*"html",*/ "copy"], function() {
  return gulp.src(paths.build)
    .pipe(notify("Build done"))
})

gulp.task("clean", function() {
  return gulp.src(paths.build+"/*", { read: false })
    .pipe(clean())
})

gulp.task("vulcanize", function() {
  var html = filter("*.html")
  return gulp.src(paths.build+'/index.html')
    //.pipe(gulp.dest("dist/"))
    .pipe(vulcanize({
      dest: paths.build,
      inline: true,
      strip: true,
      "excludes": {
        "imports": [
          "core-icons.html"
        ]
      },
      csp: true
    }))
    .pipe(rename({
      suffix: ".vulcanized"
    }))
    .pipe(gulp.dest(paths.build))
    .pipe(html)
      // .pipe(htmlmin())
    .pipe(html.restore())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(paths.build))
})

gulp.task("watch", function() {
  livereload.listen({basePath: paths.build})
  watch(paths.styles_watched, watchOpts, ["styles"])
  watch(paths.scripts, watchOpts,        ["scripts"])
  // watch(paths.html, watchOpts,           ["html"])
  watch(paths.html, watchOpts,           ["scripts"])
  watch(paths.misc_copy, watchOpts,      ["copy"])
})

gulp.task("default", ["build", "watch"], function() {

})