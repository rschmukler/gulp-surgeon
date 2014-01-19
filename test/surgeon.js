var surgeon = require('../'),
    expect = require('expect.js'),
    File = require('gulp-util').File;

describe('stitch', function() {
  it('adds the signature to the files', function(done) {
    var stream = surgeon.stitch('app.js');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('Hello')
    });

    stream.on('data', function(file) {
      var signature = /\/\/surgeon-file: /;
      expect(file.contents.toString()).to.match(signature);
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('concats all of the files into one file');
  it('has options for the newLine');
  it('has options for the comment signature');
});

describe('slice', function() {
  it('swaps out just the file from the destination');
});
