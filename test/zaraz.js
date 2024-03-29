const test = require('node:test');
const assert = require('node:assert/strict');

const zaraz = require('../');

test('must call callback with params', function (_, done) {

  zaraz(function (a, b) {
    assert.equal(a, 5);
    assert.equal(b, -3);
    done();
  }, 5, -3);
});

test('must call callbacks in order', function (_, done) {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function () {
    assert.equal(r, 'ABC');
    done();
  });
});

test('must allow to clear a callback', function (_, done) {
  let r = '';

  function fn(p) {
    r += p;
  }


  zaraz(fn, 'A');
  const b = zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function () {
    assert.equal(r, 'AC');
    done();
  });
  b.clear();
});

test('must allow for running a callback manually', function (_, done) {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  const b = zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function () {
    assert.equal(r, 'BAC');
    done();
  });
  b.run();
});

test('must postpone callbacks scheduled during callback', function (_, done) {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  zaraz(function () {
    fn('B');
    zaraz(fn, 'D');
    zaraz(function () {
      assert.equal(r, 'ABCD');
    });
  });
  zaraz(fn, 'C');
  zaraz(function () {
    assert.equal(r, 'ABC');
    done();
  });
});

test('must respect MAX_ITEMS', function (_, done) {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz.MAX_ITEMS = 2;
  zaraz(fn, 'A');
  zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(function () {
    assert.equal(r, 'ABC');
    done();
  });
});
