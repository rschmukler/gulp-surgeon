var gutil = require('gulp-util'),
    path = require('path'),
    through = require('through');

var PluginError = gutil.PluginError,
    File = gutil.File;

var COMMENT_MAP = {
  css: { start: '/*', end: '*/' },
  js:  { start: '/*', end: '*/' }
};

exports.stitch = function(fileName, opts) {
  opts = opts || {};
  if (!fileName) throw new PluginError('gulp-surgeon', 'Missing fileName for destination');

  var newLine = opts.newLine || gutil.linefeed;

  var buffer = [],
      comment, firstFile;

  var ext = fileName.split('.').pop();

  if(!opts.comment) {
    if(!(comment = COMMENT_MAP[ext])) {
      throw new PluginError('gulp-surgeon', 'Could not determine comment signature for extensions ' + ext);
    }
  } else {
    comment = opts.comment;
  }

  function write(file) {
    firstFile = firstFile || file;
    buffer.push(file.contents.toString());
  }

  function end() {
    if (buffer.length === 0) return this.emit('end');

    var joinedContents = buffer.join(newLine),
        joinedPath = path.join(firstFile.base, fileName);

    var joinedFile = new File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: new Buffer(joinedContents)
    });
    this.emit('data', joinedFile);
    this.emit('end');
  }

  return through(write, end);
};
