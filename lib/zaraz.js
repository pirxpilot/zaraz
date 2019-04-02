const debug = require('debug')('zaraz');

module.exports = zaraz;

const queues = {
  timer: undefined,
  running: false,
  current: [],
  later: []
};

const Item = {
  init(fn, params) {
    this._fn = fn;
    this._params = params;
    return this;
  },

  run() {
    // bail if nothing to run
    if (!this._fn) { return; }

    const fn = this._fn;
    this.clear();
    fn(...this._params);
  },

  clear() {
    this._fn = undefined;
  }
};

function zaraz(fn) {
  const params = [];
  let len = arguments.length;

  while(len-- > 1) {
    params[len - 1] = arguments[len];
  }

  const item = Object.create(Item).init(fn, params);
  const q = queues.running ? queues.later : queues.current;
  q.push(item);

  kick();
  return item;
}

zaraz.DELAY = 10;         // default delay
zaraz.ACTIVE = 100;       // how long before we yield after processing items
zaraz.MAX_ITEMS = 1000;   // how many items we can process in a single step

function execute() {
  const start = Date.now();
  let i = 0;
  const max = Math.min(queues.current.length, zaraz.MAX_ITEMS);

  debug('queues before', queues.current.length, queues.later.length);
  queues.running = true;

  for (i = 0; i < max; i++) {
    queues.current[i].run();
    if (Date.now() - start > zaraz.ACTIVE) {
      debug('breaking...');
      break;
    }
  }

  queues.running = false;
  debug('queues after', queues.current.length - i, queues.later.length);

  if (i === queues.current.length) {
    queues.current = queues.later;
  } else {
    queues.current = [ ...queues.current.slice(i), ...queues.later ];
  }
  queues.later = [];

  kick();
}

function kick() {
  // bail if we already have timer
  if (queues.timer) { return; }

  if (queues.current.length) {
    queues.timer = setTimeout(() => {
      queues.timer = undefined;
      execute();
    }, zaraz.DELAY);
  }
}
