var gulp = require("gulp"),
    _ = require("lodash"),
    // Utils
    clean  = require('gulp-clean'),
    rename = require("gulp-rename"),
    filter = require("gulp-filter"),
    notify = require("gulp-notify"),
    merge  = require("merge-stream"),
    path   = require("path"),

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

gulp.task("html", function() {
  return gulp.src(paths.html)
    // .pipe(htmlmin({
    //   removeComments: true,
    //   collapseWhitespace: true,
    //   removeAttributeQuotes: true,
    //   removeRedundantAttributes: true,
    //   minifyJS: true,
    //   minifyCSS: true
    // }))
    .on("error", notify.onError("[HTML] <%= error.message %>"))
    .pipe(livereload())
    .pipe(gulp.dest(paths.build))
})

gulp.task("scripts", function() {
  var src = paths.scripts
  src = src.concat(paths.html)
  return gulp.src(src)
    .pipe(to5({
      modules: 'amd'
    }))
    .on("error", notify.onError("[JS] <%= error.message%>"))
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

gulp.task("build", ["styles", "scripts", "copy"], function() {
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
  // gulp.watch(paths.html,       ["html"])
  watch(paths.html, watchOpts,           ["scripts"])
  watch(paths.misc_copy, watchOpts,      ["copy"])
})

gulp.task("default", ["build", "watch"], function() {

})