'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var applySourceMap = require('vinyl-sourcemaps-apply');
var objectAssign = require('object-assign');
var babel = require('babel-core');
var cheerio = require('cheerio');
var path = require('path');
var indent = require('detect-indent');

// matches: plain script tags, explicit js script tags
var HTML_SCRIPTS = 'script:not([type]), script[type="text/javascript"]'

function isHTMLFile(file) {
  return path.extname(file.path) === '.html'
}

function transform(code, file, opts) {
  var fileOpts = objectAssign({}, opts, {
    filename: file.path,
    filenameRelative: file.relative,
    sourceMap: !!file.sourceMap
  });

  var res = babel.transform(code, fileOpts);

  if (file.sourceMap && res.map) {
    applySourceMap(file, res.map);
  }
  return res
}

module.exports = function (opts) {
  opts = opts || {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-6to5', 'Streaming not supported'));
      return;
    }

    try {
      var codeIn = file.contents.toString();
      var codeOut;

      if (isHTMLFile(file)) {
        var $ = cheerio.load(codeIn);
        opts.modules = 'ignore';
        $(HTML_SCRIPTS).each(function (i, script) {
          var $script = $(script);
          var code = $script.text();
          if (code.match(/^\W*$/)) {
            return;
          }
          var res = transform(code, file, opts);
          $script.text("\n"+res.code+"\n");
        });
        codeOut = $.html();
      }
      else {
        codeOut = transform(codeIn, file, opts).code
      }

      file.contents = new Buffer(codeOut);
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-6to5', err, {fileName: file.path}));
    }

    cb();
  });
};