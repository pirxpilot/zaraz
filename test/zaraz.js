var zaraz = require('../');

describe('zaraz node module', function () {
  it('must call callback with params', function (done) {

    zaraz(function(a, b) {
      a.should.be.eql(5);
      b.should.be.eql(-3);
      done();
    }, 5, -3);
  });

  it('must call callbacks in order', function(done) {
    var r = '';
    function fn(p) {
      r += p;
    }

    zaraz(fn, 'A');
    zaraz(fn, 'B');
    zaraz(fn, 'C');
    zaraz(function() {
      r.should.be.eql('ABC');
      done();
    });
  });

  it('must allow to clear a callback', function(done) {
    var r = '';
    function fn(p) {
      r += p;
    }

    zaraz(fn, 'A');
    var b = zaraz(fn, 'B');
    zaraz(fn, 'C');
    zaraz(function() {
      r.should.be.eql('AC');
      done();
    });
    b.clear();
  });

  it('must allow for running a callback manually', function(done) {
    var r = '';
    function fn(p) {
      r += p;
    }

    zaraz(fn, 'A');
    var b = zaraz(fn, 'B');
    zaraz(fn, 'C');
    zaraz(function() {
      r.should.be.eql('BAC');
      done();
    });
    b.run();
  });

  it('must pospone callbacks scheduled during callback', function(done) {
    var r = '';
    function fn(p) {
      r += p;
    }

    zaraz(fn, 'A');
    zaraz(function() {
      fn('B');
      zaraz(fn, 'D');
      zaraz(function() {
        r.should.be.eql('ABCD');
        done();
      });
    });
    zaraz(fn, 'C');
    zaraz(function() {
      r.should.be.eql('ABC');
    });
  });

  it('must respect MAX_ITEMS', function(done) {
    var r = '';
    function fn(p) {
      r += p;
    }

    zaraz.MAX_ITEMS = 2;
    zaraz(fn, 'A');
    zaraz(fn, 'B');
    zaraz(fn, 'C');
    zaraz(function() {
      r.should.be.eql('ABC');
      done();
    });
  });

});
