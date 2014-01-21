var gutil = require('gulp-util'),
    path = require('path'),
    readFileSync = require('fs').readFileSync,
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
    signFile(file, comment, newLine);
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

exports.slice = function(filePath, opts) {
  opts = opts || {};
  if (!filePath) throw new PluginError('gulp-surgeon', 'Missing file path for destination');

  var newLine = opts.newLine || gutil.linefeed,
      comment;

  var ext = filePath.split('.').pop();

  if(!opts.comment) {
    if(!(comment = COMMENT_MAP[ext])) {
      throw new PluginError('gulp-surgeon', 'Could not determine comment signature for extensions ' + ext);
    }
  } else {
    comment = opts.comment;
  }

  // Read contents of path
  var destFile = new File({
    cwd: path.dirname(filePath),
    base: path.dirname(filePath),
    path: filePath,
    contents: readFileSync(filePath)
  });

  function write(file) {
    var regex = new RegExp('surgeon-file: ' + file.path);

    var buffer = destFile.contents.toString().split(newLine),
        found = false;

    signFile(file, comment, newLine);

    for(var i = 0; i < buffer.length; ++i) {
      if(regex.test(buffer[i])) {
        var numLines = parseInt(buffer[i].match(/\s\d+\s/), 10);
        var newContent = file.contents.toString().split(newLine);
        newContent.unshift(numLines);
        newContent.unshift(i);
        buffer.splice.apply(buffer, newContent);
        i += numLines;
        destFile.contents = new Buffer(buffer.join(newLine));
        found = true;
      }
    }
    if(!found) {
      if(opts.prepend) {
        destFile.contents = new Buffer(file.contents.toString() + newLine + destFile.contents.toString());
      } else {
        destFile.contents = new Buffer(destFile.contents.toString() + newLine + file.contents.toString());
      }
    }
    this.emit('data', destFile);
  }

  return through(write);
};

function signFile(file, comment, newLine) {
  var contents = file.contents.toString();
  var numLines = contents.split(newLine).length + 1; // We are adding a line
  contents = comment.start + 'surgeon-file: ' + file.path + ': ' +  numLines + ' ' + comment.end + newLine + contents;
  file.contents = new Buffer(contents);
}
