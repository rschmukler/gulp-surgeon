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
      var signature = /\/\*surgeon-file: /;
      expect(file.contents.toString()).to.match(signature);
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('concats all of the files into one file', function(done) {
    var stream = surgeon.stitch('app.js');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('Hello')
    });

    var otherFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/goodbye.js',
      contents: new Buffer('Goodbye')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.match(/Hello/);
      expect(file.contents.toString()).to.match(/Goodbye/);
      expect(file.path).to.be(__dirname + 'test/app.js');
      done();
    });
    stream.write(fakeFile);
    stream.write(otherFile);
    stream.end();
  });

  it('has options for the newLine', function(done) {
    var stream = surgeon.stitch('app.js', {newLine: '\n\r'});

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('Hello')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.match(/\n\r/);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('has options for the comment signature', function(done) {
    var stream = surgeon.stitch('app.js', {comment: {start: 'OMGBIGCOMMENTSTART', end: 'OMGBIGCOMMENTEND'}});

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('Hello')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.match(/OMGBIGCOMMENTSTART/);
      expect(file.contents.toString()).to.match(/OMGBIGCOMMENTEND/);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });
});

describe('slice', function() {
  it('swaps out just the file from the destination');
});
