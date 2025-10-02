import test from 'node:test';
import zaraz from '../lib/zaraz.js';

test('must call callback with params', (t, done) => {
  zaraz(
    (a, b) => {
      t.assert.equal(a, 5);
      t.assert.equal(b, -3);
      done();
    },
    5,
    -3
  );
});

test('must call callbacks in order', (t, done) => {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(() => {
    t.assert.equal(r, 'ABC');
    done();
  });
});

test('must allow to clear a callback', (t, done) => {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  const b = zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(() => {
    t.assert.equal(r, 'AC');
    done();
  });
  b.clear();
});

test('must allow for running a callback manually', (t, done) => {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  const b = zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(() => {
    t.assert.equal(r, 'BAC');
    done();
  });
  b.run();
});

test('must postpone callbacks scheduled during callback', (t, done) => {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz(fn, 'A');
  zaraz(() => {
    fn('B');
    zaraz(fn, 'D');
    zaraz(() => {
      t.assert.equal(r, 'ABCD');
    });
  });
  zaraz(fn, 'C');
  zaraz(() => {
    t.assert.equal(r, 'ABC');
    done();
  });
});

test('must respect MAX_ITEMS', (t, done) => {
  let r = '';

  function fn(p) {
    r += p;
  }

  zaraz.MAX_ITEMS = 2;
  zaraz(fn, 'A');
  zaraz(fn, 'B');
  zaraz(fn, 'C');
  zaraz(() => {
    t.assert.equal(r, 'ABC');
    done();
  });
});
