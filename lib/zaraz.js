module.exports = zaraz;


var queues = {
  timer: undefined,
  running: false,
  current: [],
  later: []
};

var Item = {
  run: function run() {
    if (!this._fn) {
      return;
    }
    var fn = this._fn;
    this.clear();
    fn.apply(null, this._params);
  },
  clear: function clean() {
    this._fn = undefined;
  }
};

function zaraz(fn) {
  var params = [];
  var len = arguments.length;

  while(len-- > 1) {
    params[len - 1] = arguments[len];
  }

  var item = Object.create(Item);
  item._fn = fn;
  item._params = params;

  var q = queues.running ? queues.later : queues.current;
  q.push(item);

  kick();
  return item;
}

zaraz.DELAY = 10;

function execute() {
  queues.timer = undefined;
  queues.running = true;
  try {
    queues.current.forEach(function(item) {
      item.run();
    });
  } finally {
    queues.running = false;
  }
  queues.current = queues.later;
  queues.later = [];
  kick();
}

function kick() {
  if (queues.timer) {
    return;
  }
  if (queues.current.length) {
    queues.timer = setTimeout(execute, zaraz.DELAY);
  }
}

