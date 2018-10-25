(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var es6Promise = createCommonjsModule(function (module, exports) {
	/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   v4.2.5+7f2b526d
	 */

	(function (global, factory) {
		module.exports = factory();
	}(commonjsGlobal, (function () {
	function objectOrFunction(x) {
	  var type = typeof x;
	  return x !== null && (type === 'object' || type === 'function');
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}



	var _isArray = void 0;
	if (Array.isArray) {
	  _isArray = Array.isArray;
	} else {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = void 0;
	var customSchedulerFn = void 0;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }

	  return useSetTimeout();
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var vertx = Function('return this')().require('vertx');
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = void 0;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;


	  if (_state) {
	    var callback = arguments[_state - 1];
	    asap(function () {
	      return invokeCallback(_state, child, callback, parent._result);
	    });
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve$1(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(2);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var TRY_CATCH_ERROR = { error: null };

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    TRY_CATCH_ERROR.error = error;
	    return TRY_CATCH_ERROR;
	  }
	}

	function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then$$1.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then$$1) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then$$1, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return resolve(promise, value);
	    }, function (reason) {
	      return reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$1) {
	  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$1 === TRY_CATCH_ERROR) {
	      reject(promise, TRY_CATCH_ERROR.error);
	      TRY_CATCH_ERROR.error = null;
	    } else if (then$$1 === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$1)) {
	      handleForeignThenable(promise, maybeThenable, then$$1);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function resolve(promise, value) {
	  if (promise === value) {
	    reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;


	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = void 0,
	      callback = void 0,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = void 0,
	      error = void 0,
	      succeeded = void 0,
	      failed = void 0;

	  if (hasCallback) {
	    value = tryCatch(callback, detail);

	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value.error = null;
	    } else {
	      succeeded = true;
	    }

	    if (promise === value) {
	      reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }

	  if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
	    resolve(promise, value);
	  } else if (failed) {
	    reject(promise, error);
	  } else if (settled === FULFILLED) {
	    fulfill(promise, value);
	  } else if (settled === REJECTED) {
	    reject(promise, value);
	  }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      resolve(promise, value);
	    }, function rejectPromise(reason) {
	      reject(promise, reason);
	    });
	  } catch (e) {
	    reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	}

	var Enumerator = function () {
	  function Enumerator(Constructor, input) {
	    this._instanceConstructor = Constructor;
	    this.promise = new Constructor(noop);

	    if (!this.promise[PROMISE_ID]) {
	      makePromise(this.promise);
	    }

	    if (isArray(input)) {
	      this.length = input.length;
	      this._remaining = input.length;

	      this._result = new Array(this.length);

	      if (this.length === 0) {
	        fulfill(this.promise, this._result);
	      } else {
	        this.length = this.length || 0;
	        this._enumerate(input);
	        if (this._remaining === 0) {
	          fulfill(this.promise, this._result);
	        }
	      }
	    } else {
	      reject(this.promise, validationError());
	    }
	  }

	  Enumerator.prototype._enumerate = function _enumerate(input) {
	    for (var i = 0; this._state === PENDING && i < input.length; i++) {
	      this._eachEntry(input[i], i);
	    }
	  };

	  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
	    var c = this._instanceConstructor;
	    var resolve$$1 = c.resolve;


	    if (resolve$$1 === resolve$1) {
	      var _then = getThen(entry);

	      if (_then === then && entry._state !== PENDING) {
	        this._settledAt(entry._state, i, entry._result);
	      } else if (typeof _then !== 'function') {
	        this._remaining--;
	        this._result[i] = entry;
	      } else if (c === Promise$1) {
	        var promise = new c(noop);
	        handleMaybeThenable(promise, entry, _then);
	        this._willSettleAt(promise, i);
	      } else {
	        this._willSettleAt(new c(function (resolve$$1) {
	          return resolve$$1(entry);
	        }), i);
	      }
	    } else {
	      this._willSettleAt(resolve$$1(entry), i);
	    }
	  };

	  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
	    var promise = this.promise;


	    if (promise._state === PENDING) {
	      this._remaining--;

	      if (state === REJECTED) {
	        reject(promise, value);
	      } else {
	        this._result[i] = value;
	      }
	    }

	    if (this._remaining === 0) {
	      fulfill(promise, this._result);
	    }
	  };

	  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
	    var enumerator = this;

	    subscribe(promise, undefined, function (value) {
	      return enumerator._settledAt(FULFILLED, i, value);
	    }, function (reason) {
	      return enumerator._settledAt(REJECTED, i, reason);
	    });
	  };

	  return Enumerator;
	}();

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject$1(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {Function} resolver
	  Useful for tooling.
	  @constructor
	*/

	var Promise$1 = function () {
	  function Promise(resolver) {
	    this[PROMISE_ID] = nextId();
	    this._result = this._state = undefined;
	    this._subscribers = [];

	    if (noop !== resolver) {
	      typeof resolver !== 'function' && needsResolver();
	      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	    }
	  }

	  /**
	  The primary way of interacting with a promise is through its `then` method,
	  which registers callbacks to receive either a promise's eventual value or the
	  reason why the promise cannot be fulfilled.
	   ```js
	  findUser().then(function(user){
	    // user is available
	  }, function(reason){
	    // user is unavailable, and you are given the reason why
	  });
	  ```
	   Chaining
	  --------
	   The return value of `then` is itself a promise.  This second, 'downstream'
	  promise is resolved with the return value of the first promise's fulfillment
	  or rejection handler, or rejected if the handler throws an exception.
	   ```js
	  findUser().then(function (user) {
	    return user.name;
	  }, function (reason) {
	    return 'default name';
	  }).then(function (userName) {
	    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	    // will be `'default name'`
	  });
	   findUser().then(function (user) {
	    throw new Error('Found user, but still unhappy');
	  }, function (reason) {
	    throw new Error('`findUser` rejected and we're unhappy');
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	  });
	  ```
	  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	   ```js
	  findUser().then(function (user) {
	    throw new PedagogicalException('Upstream error');
	  }).then(function (value) {
	    // never reached
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // The `PedgagocialException` is propagated all the way down to here
	  });
	  ```
	   Assimilation
	  ------------
	   Sometimes the value you want to propagate to a downstream promise can only be
	  retrieved asynchronously. This can be achieved by returning a promise in the
	  fulfillment or rejection handler. The downstream promise will then be pending
	  until the returned promise is settled. This is called *assimilation*.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // The user's comments are now available
	  });
	  ```
	   If the assimliated promise rejects, then the downstream promise will also reject.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // If `findCommentsByAuthor` fulfills, we'll have the value here
	  }, function (reason) {
	    // If `findCommentsByAuthor` rejects, we'll have the reason here
	  });
	  ```
	   Simple Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let result;
	   try {
	    result = findResult();
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	  findResult(function(result, err){
	    if (err) {
	      // failure
	    } else {
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findResult().then(function(result){
	    // success
	  }, function(reason){
	    // failure
	  });
	  ```
	   Advanced Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let author, books;
	   try {
	    author = findAuthor();
	    books  = findBooksByAuthor(author);
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	   function foundBooks(books) {
	   }
	   function failure(reason) {
	   }
	   findAuthor(function(author, err){
	    if (err) {
	      failure(err);
	      // failure
	    } else {
	      try {
	        findBoooksByAuthor(author, function(books, err) {
	          if (err) {
	            failure(err);
	          } else {
	            try {
	              foundBooks(books);
	            } catch(reason) {
	              failure(reason);
	            }
	          }
	        });
	      } catch(error) {
	        failure(err);
	      }
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findAuthor().
	    then(findBooksByAuthor).
	    then(function(books){
	      // found books
	  }).catch(function(reason){
	    // something went wrong
	  });
	  ```
	   @method then
	  @param {Function} onFulfilled
	  @param {Function} onRejected
	  Useful for tooling.
	  @return {Promise}
	  */

	  /**
	  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	  as the catch block of a try/catch statement.
	  ```js
	  function findAuthor(){
	  throw new Error('couldn't find that author');
	  }
	  // synchronous
	  try {
	  findAuthor();
	  } catch(reason) {
	  // something went wrong
	  }
	  // async with promises
	  findAuthor().catch(function(reason){
	  // something went wrong
	  });
	  ```
	  @method catch
	  @param {Function} onRejection
	  Useful for tooling.
	  @return {Promise}
	  */


	  Promise.prototype.catch = function _catch(onRejection) {
	    return this.then(null, onRejection);
	  };

	  /**
	    `finally` will be invoked regardless of the promise's fate just as native
	    try/catch/finally behaves
	  
	    Synchronous example:
	  
	    ```js
	    findAuthor() {
	      if (Math.random() > 0.5) {
	        throw new Error();
	      }
	      return new Author();
	    }
	  
	    try {
	      return findAuthor(); // succeed or fail
	    } catch(error) {
	      return findOtherAuther();
	    } finally {
	      // always runs
	      // doesn't affect the return value
	    }
	    ```
	  
	    Asynchronous example:
	  
	    ```js
	    findAuthor().catch(function(reason){
	      return findOtherAuther();
	    }).finally(function(){
	      // author was either found, or not
	    });
	    ```
	  
	    @method finally
	    @param {Function} callback
	    @return {Promise}
	  */


	  Promise.prototype.finally = function _finally(callback) {
	    var promise = this;
	    var constructor = promise.constructor;

	    if (isFunction(callback)) {
	      return promise.then(function (value) {
	        return constructor.resolve(callback()).then(function () {
	          return value;
	        });
	      }, function (reason) {
	        return constructor.resolve(callback()).then(function () {
	          throw reason;
	        });
	      });
	    }

	    return promise.then(callback, callback);
	  };

	  return Promise;
	}();

	Promise$1.prototype.then = then;
	Promise$1.all = all;
	Promise$1.race = race;
	Promise$1.resolve = resolve$1;
	Promise$1.reject = reject$1;
	Promise$1._setScheduler = setScheduler;
	Promise$1._setAsap = setAsap;
	Promise$1._asap = asap;

	/*global self*/
	function polyfill() {
	  var local = void 0;

	  if (typeof commonjsGlobal !== 'undefined') {
	    local = commonjsGlobal;
	  } else if (typeof self !== 'undefined') {
	    local = self;
	  } else {
	    try {
	      local = Function('return this')();
	    } catch (e) {
	      throw new Error('polyfill failed because global object is unavailable in this environment');
	    }
	  }

	  var P = local.Promise;

	  if (P) {
	    var promiseToString = null;
	    try {
	      promiseToString = Object.prototype.toString.call(P.resolve());
	    } catch (e) {
	      // silently ignored
	    }

	    if (promiseToString === '[object Promise]' && !P.cast) {
	      return;
	    }
	  }

	  local.Promise = Promise$1;
	}

	// Strange compat..
	Promise$1.polyfill = polyfill;
	Promise$1.Promise = Promise$1;

	return Promise$1;

	})));




	});

	var support = {
	  searchParams: 'URLSearchParams' in self,
	  iterable: 'Symbol' in self && 'iterator' in Symbol,
	  blob:
	    'FileReader' in self &&
	    'Blob' in self &&
	    (function() {
	      try {
	        new Blob();
	        return true
	      } catch (e) {
	        return false
	      }
	    })(),
	  formData: 'FormData' in self,
	  arrayBuffer: 'ArrayBuffer' in self
	};

	function isDataView(obj) {
	  return obj && DataView.prototype.isPrototypeOf(obj)
	}

	if (support.arrayBuffer) {
	  var viewClasses = [
	    '[object Int8Array]',
	    '[object Uint8Array]',
	    '[object Uint8ClampedArray]',
	    '[object Int16Array]',
	    '[object Uint16Array]',
	    '[object Int32Array]',
	    '[object Uint32Array]',
	    '[object Float32Array]',
	    '[object Float64Array]'
	  ];

	  var isArrayBufferView =
	    ArrayBuffer.isView ||
	    function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    };
	}

	function normalizeName(name) {
	  if (typeof name !== 'string') {
	    name = String(name);
	  }
	  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
	    throw new TypeError('Invalid character in header field name')
	  }
	  return name.toLowerCase()
	}

	function normalizeValue(value) {
	  if (typeof value !== 'string') {
	    value = String(value);
	  }
	  return value
	}

	// Build a destructive iterator for the value list
	function iteratorFor(items) {
	  var iterator = {
	    next: function() {
	      var value = items.shift();
	      return {done: value === undefined, value: value}
	    }
	  };

	  if (support.iterable) {
	    iterator[Symbol.iterator] = function() {
	      return iterator
	    };
	  }

	  return iterator
	}

	function Headers(headers) {
	  this.map = {};

	  if (headers instanceof Headers) {
	    headers.forEach(function(value, name) {
	      this.append(name, value);
	    }, this);
	  } else if (Array.isArray(headers)) {
	    headers.forEach(function(header) {
	      this.append(header[0], header[1]);
	    }, this);
	  } else if (headers) {
	    Object.getOwnPropertyNames(headers).forEach(function(name) {
	      this.append(name, headers[name]);
	    }, this);
	  }
	}

	Headers.prototype.append = function(name, value) {
	  name = normalizeName(name);
	  value = normalizeValue(value);
	  var oldValue = this.map[name];
	  this.map[name] = oldValue ? oldValue + ', ' + value : value;
	};

	Headers.prototype['delete'] = function(name) {
	  delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function(name) {
	  name = normalizeName(name);
	  return this.has(name) ? this.map[name] : null
	};

	Headers.prototype.has = function(name) {
	  return this.map.hasOwnProperty(normalizeName(name))
	};

	Headers.prototype.set = function(name, value) {
	  this.map[normalizeName(name)] = normalizeValue(value);
	};

	Headers.prototype.forEach = function(callback, thisArg) {
	  for (var name in this.map) {
	    if (this.map.hasOwnProperty(name)) {
	      callback.call(thisArg, this.map[name], name, this);
	    }
	  }
	};

	Headers.prototype.keys = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push(name);
	  });
	  return iteratorFor(items)
	};

	Headers.prototype.values = function() {
	  var items = [];
	  this.forEach(function(value) {
	    items.push(value);
	  });
	  return iteratorFor(items)
	};

	Headers.prototype.entries = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push([name, value]);
	  });
	  return iteratorFor(items)
	};

	if (support.iterable) {
	  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	}

	function consumed(body) {
	  if (body.bodyUsed) {
	    return es6Promise.reject(new TypeError('Already read'))
	  }
	  body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
	  return new es6Promise(function(resolve, reject) {
	    reader.onload = function() {
	      resolve(reader.result);
	    };
	    reader.onerror = function() {
	      reject(reader.error);
	    };
	  })
	}

	function readBlobAsArrayBuffer(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsArrayBuffer(blob);
	  return promise
	}

	function readBlobAsText(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsText(blob);
	  return promise
	}

	function readArrayBufferAsText(buf) {
	  var view = new Uint8Array(buf);
	  var chars = new Array(view.length);

	  for (var i = 0; i < view.length; i++) {
	    chars[i] = String.fromCharCode(view[i]);
	  }
	  return chars.join('')
	}

	function bufferClone(buf) {
	  if (buf.slice) {
	    return buf.slice(0)
	  } else {
	    var view = new Uint8Array(buf.byteLength);
	    view.set(new Uint8Array(buf));
	    return view.buffer
	  }
	}

	function Body() {
	  this.bodyUsed = false;

	  this._initBody = function(body) {
	    this._bodyInit = body;
	    if (!body) {
	      this._bodyText = '';
	    } else if (typeof body === 'string') {
	      this._bodyText = body;
	    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	      this._bodyBlob = body;
	    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	      this._bodyFormData = body;
	    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	      this._bodyText = body.toString();
	    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	      this._bodyArrayBuffer = bufferClone(body.buffer);
	      // IE 10-11 can't handle a DataView body.
	      this._bodyInit = new Blob([this._bodyArrayBuffer]);
	    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	      this._bodyArrayBuffer = bufferClone(body);
	    } else {
	      this._bodyText = body = Object.prototype.toString.call(body);
	    }

	    if (!this.headers.get('content-type')) {
	      if (typeof body === 'string') {
	        this.headers.set('content-type', 'text/plain;charset=UTF-8');
	      } else if (this._bodyBlob && this._bodyBlob.type) {
	        this.headers.set('content-type', this._bodyBlob.type);
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	      }
	    }
	  };

	  if (support.blob) {
	    this.blob = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return es6Promise.resolve(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return es6Promise.resolve(new Blob([this._bodyArrayBuffer]))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as blob')
	      } else {
	        return es6Promise.resolve(new Blob([this._bodyText]))
	      }
	    };

	    this.arrayBuffer = function() {
	      if (this._bodyArrayBuffer) {
	        return consumed(this) || es6Promise.resolve(this._bodyArrayBuffer)
	      } else {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	    };
	  }

	  this.text = function() {
	    var rejected = consumed(this);
	    if (rejected) {
	      return rejected
	    }

	    if (this._bodyBlob) {
	      return readBlobAsText(this._bodyBlob)
	    } else if (this._bodyArrayBuffer) {
	      return es6Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	    } else if (this._bodyFormData) {
	      throw new Error('could not read FormData body as text')
	    } else {
	      return es6Promise.resolve(this._bodyText)
	    }
	  };

	  if (support.formData) {
	    this.formData = function() {
	      return this.text().then(decode)
	    };
	  }

	  this.json = function() {
	    return this.text().then(JSON.parse)
	  };

	  return this
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
	  var upcased = method.toUpperCase();
	  return methods.indexOf(upcased) > -1 ? upcased : method
	}

	function Request(input, options) {
	  options = options || {};
	  var body = options.body;

	  if (input instanceof Request) {
	    if (input.bodyUsed) {
	      throw new TypeError('Already read')
	    }
	    this.url = input.url;
	    this.credentials = input.credentials;
	    if (!options.headers) {
	      this.headers = new Headers(input.headers);
	    }
	    this.method = input.method;
	    this.mode = input.mode;
	    this.signal = input.signal;
	    if (!body && input._bodyInit != null) {
	      body = input._bodyInit;
	      input.bodyUsed = true;
	    }
	  } else {
	    this.url = String(input);
	  }

	  this.credentials = options.credentials || this.credentials || 'same-origin';
	  if (options.headers || !this.headers) {
	    this.headers = new Headers(options.headers);
	  }
	  this.method = normalizeMethod(options.method || this.method || 'GET');
	  this.mode = options.mode || this.mode || null;
	  this.signal = options.signal || this.signal;
	  this.referrer = null;

	  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	    throw new TypeError('Body not allowed for GET or HEAD requests')
	  }
	  this._initBody(body);
	}

	Request.prototype.clone = function() {
	  return new Request(this, {body: this._bodyInit})
	};

	function decode(body) {
	  var form = new FormData();
	  body
	    .trim()
	    .split('&')
	    .forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	  return form
	}

	function parseHeaders(rawHeaders) {
	  var headers = new Headers();
	  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	  // https://tools.ietf.org/html/rfc7230#section-3.2
	  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	    var parts = line.split(':');
	    var key = parts.shift().trim();
	    if (key) {
	      var value = parts.join(':').trim();
	      headers.append(key, value);
	    }
	  });
	  return headers
	}

	Body.call(Request.prototype);

	function Response(bodyInit, options) {
	  if (!options) {
	    options = {};
	  }

	  this.type = 'default';
	  this.status = options.status === undefined ? 200 : options.status;
	  this.ok = this.status >= 200 && this.status < 300;
	  this.statusText = 'statusText' in options ? options.statusText : 'OK';
	  this.headers = new Headers(options.headers);
	  this.url = options.url || '';
	  this._initBody(bodyInit);
	}

	Body.call(Response.prototype);

	Response.prototype.clone = function() {
	  return new Response(this._bodyInit, {
	    status: this.status,
	    statusText: this.statusText,
	    headers: new Headers(this.headers),
	    url: this.url
	  })
	};

	Response.error = function() {
	  var response = new Response(null, {status: 0, statusText: ''});
	  response.type = 'error';
	  return response
	};

	var redirectStatuses = [301, 302, 303, 307, 308];

	Response.redirect = function(url, status) {
	  if (redirectStatuses.indexOf(status) === -1) {
	    throw new RangeError('Invalid status code')
	  }

	  return new Response(null, {status: status, headers: {location: url}})
	};

	var DOMException = self.DOMException;
	try {
	  new DOMException();
	} catch (err) {
	  DOMException = function(message, name) {
	    this.message = message;
	    this.name = name;
	    var error = Error(message);
	    this.stack = error.stack;
	  };
	  DOMException.prototype = Object.create(Error.prototype);
	  DOMException.prototype.constructor = DOMException;
	}

	function fetch$1(input, init) {
	  return new es6Promise(function(resolve, reject) {
	    var request = new Request(input, init);

	    if (request.signal && request.signal.aborted) {
	      return reject(new DOMException('Aborted', 'AbortError'))
	    }

	    var xhr = new XMLHttpRequest();

	    function abortXhr() {
	      xhr.abort();
	    }

	    xhr.onload = function() {
	      var options = {
	        status: xhr.status,
	        statusText: xhr.statusText,
	        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	      };
	      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	      var body = 'response' in xhr ? xhr.response : xhr.responseText;
	      resolve(new Response(body, options));
	    };

	    xhr.onerror = function() {
	      reject(new TypeError('Network request failed'));
	    };

	    xhr.ontimeout = function() {
	      reject(new TypeError('Network request failed'));
	    };

	    xhr.onabort = function() {
	      reject(new DOMException('Aborted', 'AbortError'));
	    };

	    xhr.open(request.method, request.url, true);

	    if (request.credentials === 'include') {
	      xhr.withCredentials = true;
	    } else if (request.credentials === 'omit') {
	      xhr.withCredentials = false;
	    }

	    if ('responseType' in xhr && support.blob) {
	      xhr.responseType = 'blob';
	    }

	    request.headers.forEach(function(value, name) {
	      xhr.setRequestHeader(name, value);
	    });

	    if (request.signal) {
	      request.signal.addEventListener('abort', abortXhr);

	      xhr.onreadystatechange = function() {
	        // DONE (success or failure)
	        if (xhr.readyState === 4) {
	          request.signal.removeEventListener('abort', abortXhr);
	        }
	      };
	    }

	    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	  })
	}

	fetch$1.polyfill = true;

	if (!self.fetch) {
	  self.fetch = fetch$1;
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	}

	/**
	 * Invailde config
	 * @param  {String} message is discription you want to add to the error.
	 * @return {Error}          a new error with the correct name and message.
	 */
	function invaildeConfig (message) {
	  var error = new Error(message);
	  error.name = 'invaildeConfig';
	  return error;
	}

	/**
	 * Returns the window object that this script should inject into
	 * @param  {Boolean} shouldBreak is whether or not the script should attempt
	 *                               to break from iframe.
	 * @return {Window} the working window
	 */
	function getWindow (shouldBreak) {
	  var workingWindow = window;
	  if (shouldBreak) {
	    try {
	      while (workingWindow !== workingWindow.top) {
	        // The order here is important, as the first line may
	        // throw a security error and break the loop.
	        workingWindow.parent.location.href;
	        workingWindow = workingWindow.parent;
	      }
	    } catch (e) {}
	  }
	  return workingWindow;
	}

	/**
	 * Search for <link rel="canonical"> elements or fallback to use the page
	 * localtion. If a "userOverrideRef" is defined than is returned but URL encoded
	 * @param  {Object}  window          is the window object you want to get the
	 *                                   canonical link tag from.
	 * @param  {Boolean} inApp           is used to control if the page ref should
	 *                                   be set to "about:blank" as it will cause
	 *                                   errors to throw if "window.localtion" is
	 *                                   accessed in some cases.
	 * @param  {String}  userOverrideRef is the over the canonical or window
	 *                                   localtion is specified.
	 * @return {String}  canonical string or page localtion URL encoded
	 */
	function getRef (window, inApp, userOverrideRef) {
	  if (
	    userOverrideRef &&
	    typeof userOverrideRef !== 'undefined' &&
	    userOverrideRef !== ''
	  ) {
	    return encodeURIComponent(userOverrideRef);
	  }

	  var links = window.document.getElementsByTagName('link');
	  var location = window.location.href;

	  var canonical = null;
	  var ref = '';

	  for (var i = 0; i < links.length; i++) {
	    if (links[i].rel === 'canonical') {
	      canonical = links[i].href;
	      break;
	    }
	  }

	  if (inApp) {
	    ref = 'about:blank';
	  } else {
	    ref = encodeURIComponent(canonical || location);
	  }

	  return ref;
	}

	/**
	 * Binds the "__f8" object and API to the window
	 * @param {String} version      is the version to bind the API under
	 * @param {Object} targetWindow is window to bind the "__f8" object to
	 */
	function bindf8ToWindow (version, targetWindow) {
	  if (!targetWindow.__f8) {
	    targetWindow.__f8 = {};
	  }

	  if (!targetWindow.__f8[version]) {
	    targetWindow.__f8[version] = {};
	  }

	  /**
	   * Check if key exists, returns existing value
	   * or replaces it with val
	   * @param  {String}   key        - Key to access value
	   * @param  {Function|Object} val - any value
	   * @return {Object}              - assigned value for key
	   */
	  targetWindow.__f8[version].setUndefinedProperty = function (key, val) {
	    if (targetWindow.__f8[version][key]) {
	      return targetWindow.__f8[version][key];
	    } else if (val) {
	      if (typeof val === 'function') {
	        targetWindow.__f8[version][key] = val();
	        return targetWindow.__f8[version][key];
	      } else {
	        targetWindow.__f8[version][key] = val;
	        return val;
	      }
	    } else {
	      throw new Error(
	        'Trying to access f8 v' +
	          version +
	          ' property ' +
	          key +
	          ', but its not defined'
	      );
	    }
	  };
	}

	/**
	 * Injects a script tag onto the page
	 * @param  {String} creativeSource is the URL for the script you want to append
	 *                                 to the page.
	 */
	function injectScriptFactory (creativeSource) {
	  var creativeTag = document.createElement('script');
	  creativeTag.type = 'text/javascript';
	  creativeTag.src = creativeSource;
	  creativeTag.async = 'async';
	  document.body.appendChild(creativeTag);
	}

	/**
	 * Takes a config object and vaildates it
	 * @param  {Object} config is the user defined config object
	 * @return {Object}        the vaildated object
	 */
	function vaildateConfig (config) {
	  if ( config === void 0 ) config = {};

	  if (typeof config.instID === 'undefined' || config.instID === '') {
	    throw invaildeConfig('Missing "instID" in config');
	  }

	  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
	    config.endpoint = "https://fresh8.co/" + (config.instID) + "/raw";
	  }

	  if (typeof config.inApp === 'undefined') {
	    config.inApp = false;
	  }

	  if (typeof config.shouldBreakOut === 'undefined') {
	    config.shouldBreakOut = false;
	  }

	  if (typeof config.listenOnPushState === 'undefined') {
	    config.listenOnPushState = false;
	  }

	  return config;
	}

	/**
	 * Makes a request to the ad server API building the URL from the config params
	 * passed in.
	 * @param  {Object} config is the configurations used to make the API reqeuest
	 *                         E.G.
	 *                         { slotID: 'f8-001'
	 *                         , view: 'home-page' - optional
	 *                         , clickTrackingRedirect: 'http://dfp.com?r=' - optional
	 *                         , sport: 'football' - optional
	 *                         , match: - optional
	 *                         , competitorIDs: ['55436'] - optional Opta ID's
	 *                         , competitors: ['Manchester United', 'Southampton'] - optinal
	 *                         , competitionIDs: ['1245'] - optional Opta ID's
	 *                         , competitions: ['Premier League'] - optional
	 *                         , window: the window used to extra the page ref from
	 *                         , inApp: false - optional
	 *                         , endpoint: '' - optional
	 *                         , linkSameWindow: true - optional
	 *                         , brand: 'my-brand-name' - optional
	 *                         , url: 'http://fresh8gaming.com' - optional
	 *                         }
	 * @return {Promise}
	 */
	function requestAdData (config) {
	  var vaildatedConfig = vaildateRequestAdConf(config);
	  // Build the end point URL with the slot ID
	  var endpoint = constructRequestURL(vaildatedConfig.endpoint, {
	    slot: vaildatedConfig.slotID,
	    view: vaildatedConfig.view,
	    clickUrl: vaildatedConfig.clickTrackingRedirect,
	    sport: vaildatedConfig.sport,
	    match: vaildatedConfig.match,
	    competitorIds: vaildatedConfig.competitorIDs,
	    competitors: vaildatedConfig.competitors,
	    competitionIds: vaildatedConfig.competitionIDs,
	    competitions: vaildatedConfig.competitions,
	    linkSameWindow: vaildatedConfig.linkSameWindow,
	    brand: vaildatedConfig.brand,
	    ref: getRef(
	      vaildatedConfig.window,
	      vaildatedConfig.inApp,
	      vaildatedConfig.url
	    )
	  });
	  return fetch(endpoint, { credentials: 'include' })
	    .then(checkStatusCode)
	    .then(parseJSON);
	}

	/**
	 * Checks the stats code on a response and rejects the promise chain if
	 * less than 200 or greater than 300.
	 * @param  {Object} response is the fetch response object
	 * @return {(Promise.reject|Object)} a rejected promise or the reponse object
	 */
	function checkStatusCode (response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response;
	  }

	  return es6Promise.reject('Server returned error: ' + response.status);
	}

	/**
	 * Returns the json from a fetch request
	 * @param  {Object} response is the fetch response object
	 * @return {Object} the parsed JSON object
	 */
	function parseJSON (response) {
	  if (response) {
	    return response.json();
	  }
	}

	/**
	 * Builds the request URL from the config with the option to add extra
	 * key/value.
	 * @param  {Object} options is used for adding extra key values to the URL
	 *                          as a query strings.
	 * @return {String}         The constructed URL
	 */
	function constructRequestURL (url, options) {
	  if ( options === void 0 ) options = {};

	  var queryStringsOptions = Object.assign({}, options);

	  if (typeof queryStringsOptions.competitorIds !== 'undefined') {
	    queryStringsOptions.competitorIds = queryStringsOptions.competitorIds.map(
	      function (value) { return encodeURIComponent(value); }
	    );
	  }

	  if (typeof queryStringsOptions.competitors !== 'undefined') {
	    queryStringsOptions.competitors = queryStringsOptions.competitors.map(
	      function (value) { return encodeURIComponent(value); }
	    );
	  }

	  if (typeof queryStringsOptions.competitionIds !== 'undefined') {
	    queryStringsOptions.competitionIds = queryStringsOptions.competitionIds.map(
	      function (value) { return encodeURIComponent(value); }
	    );
	  }

	  if (typeof queryStringsOptions.competitions !== 'undefined') {
	    queryStringsOptions.competitions = queryStringsOptions.competitions.map(
	      function (value) { return encodeURIComponent(value); }
	    );
	  }

	  var queryString = buildQueryString(queryStringsOptions);
	  return url + queryString;
	}

	/**
	 * Takes a requestAd conf object and vaildates it
	 * @param  {Object} config is the user defined config object
	 * @return {Object}        the vaildated object
	 */
	function vaildateRequestAdConf (config) {
	  if ( config === void 0 ) config = {};

	  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
	    throw invaildeConfig('Missing "endpoint"');
	  }

	  if (typeof config.slotID === 'undefined' || config.slotID === '') {
	    throw invaildeConfig('Missing "slotID"');
	  }

	  if (typeof config.window === 'undefined' || config.window === '') {
	    throw invaildeConfig('Missing "window"');
	  }

	  if (typeof config.inApp === 'undefined') {
	    config.inApp = false;
	  }

	  if (typeof config.shouldBreakOut === 'undefined') {
	    config.shouldBreakOut = false;
	  }

	  if (typeof config.linkSameWindow === 'undefined') {
	    config.linkSameWindow = false;
	  }

	  if (typeof config.competitorIDs === 'undefined') {
	    config.competitorIDs = [];
	  }

	  if (typeof config.competitors === 'undefined') {
	    config.competitors = [];
	  }

	  if (typeof config.competitionIDs === 'undefined') {
	    config.competitionIDs = [];
	  }

	  if (typeof config.competitions === 'undefined') {
	    config.competitions = [];
	  }

	  if (typeof config.listenOnPushState === 'undefined') {
	    config.listenOnPushState = false;
	  }

	  if (
	    (config.competitors.length !== 0 || config.competitions.length !== 0) &&
	    !config.sport
	  ) {
	    throw invaildeConfig(
	      'Sport is required if "competitions" or "competitors" is passed through in the config'
	    );
	  }

	  return config;
	}

	/**
	 * Takes a dictionary and converts it to a queryString
	 * @param  {Object} dictionary is a dictionary of string key's to
	 *                             string values.
	 * @return {String} a queryString in the form of `?key=val&keyTwo=valTwo`.
	 */
	function buildQueryString (options) {
	  var queryString = '?';
	  Object.keys(options).forEach(function (option) {
	    var value = options[option];
	    if (value && value !== '' && value.length !== 0) {
	      if (Object.prototype.toString.call(value) === '[object Array]') {
	        queryString += option + '=' + value.join(',') + '&';
	      } else {
	        queryString += option + '=' + value + '&';
	      }
	    }
	  });

	  return queryString;
	}

	var Ad = function Ad (config) {
	  if ( config === void 0 ) config = {};

	  // Use to indercate if the ad has been distroyed.
	  this.active = false;
	  // awaitingFactory is used when slecting what ad classes require an creative
	  // factory.
	  this.awaitingFactory = true;
	  // selector is use for selecting the ad in the DOM and is set by the "load"
	  // method.
	  this.selector = null;
	  // creativeRef this the creative type. Set by the "load" method and updated
	  // by the "_reload" method.
	  this.creativeRef = null;
	  // creativePath is the path to the js file needed to load the ad. Set by the
	  // "load" method and updated by the "_reload" method.
	  this.creativePath = null;
	  // CSSPath is the path to the CSS file needed to load the brand. Set by the
	  // "load" method and updated by the "_reload" method.
	  this.CSSPath = null;
	  // data is the payload data for the ad factory. Set by the "load" method
	  // and updated by the "_reload" method.
	  this.data = null;
	  // env is the payload data for the ad factory. Set by the "load" method and
	  // updated by the "_reload" method.
	  this.env = null;
	  // loadResolvers env data for the ad factory. Set by the "load" method and
	  // updated by the "_reload" method.
	  this.loadResolvers = null;
	  // adInstance is a refernce to the ad instance loaded by the creative factory.
	  // Set by the "load" method and updated by the "_reload" method.
	  this.adInstance = null;
	  // config for the ad class.
	  this.config = vaildateConfig$1(config);
	  // creativeFactoryCache is the global cache for the creative factories.
	  this.creativeFactoryCache = config.creativeFactoryCache;
	  // window is a refernce to the window object used when make API requests.
	  this.window = config.window;
	  // is it an evo product (default to false)
	  this.evo = false;
	};

	/**
	 * Fetches the data for the ad and loads the ad on the page while updating a
	 * lot the ad's state.
	 * @return {Promise} Resolve when the ad finishes loading and returns an
	 *                 instance of the ad class.
	 */
	Ad.prototype.load = function load () {
	    var this$1 = this;

	  return new es6Promise(function (resolve, reject) {
	    // Construct the object for the request data
	    var requestConfig = {
	      slotID: this$1.config.slotID,
	      view: this$1.config.view,
	      clickTrackingRedirect: this$1.config.clickTrackingRedirect,
	      sport: this$1.config.sport,
	      match: this$1.config.match,
	      competitorIDs: this$1.config.competitorIDs,
	      competitors: this$1.config.competitors,
	      competitionIDs: this$1.config.competitionIDs,
	      competitions: this$1.config.competitions,
	      window: this$1.config.window,
	      inApp: this$1.config.inApp,
	      endpoint: this$1.config.endpoint,
	      appendPoint: this$1.config.appendPoint,
	      linkSameWindow: this$1.config.linkSameWindow,
	      url: this$1.config.url,
	      brand: this$1.config.brand
	    };
	    // Make the API request to the ad server
	    return requestAdData(requestConfig)
	      .then(function (payload) {
	        var resolvers = {
	          resolve: resolve,
	          reject: reject
	        };
	        // Save the promise so it can be revoled after the creative script
	        // has loaded.
	        this$1.loadResolvers = resolvers;
	        // if env exists assume it
	        // Inject the scripts for each ad.
	        if (payload.env) {
	          this$1.evo = true;
	        }
	        if (this$1.evo) {
	          Object.keys(payload.products).forEach(function (product) {
	            this$1.creativeRef = payload.products[product].config;
	            this$1.CSSPath = payload.products[product].skin;
	            // this.CSSPath = `${payload.env.cdn}/${
	              // payload.products[product].skin
	              // }.json`;
	            this$1.data = payload.products[product].instances[0];
	            this$1.env = payload.env;
	            this$1.creativePath = (payload.env.cdn) + "/" + (payload.products[product].config) + ".js?v=" + (payload.env.version);
	            this$1.data.appendPoint = this$1.config.appendPoint;
	          });
	        } else {
	          Object.keys(payload).forEach(function (creativeRef) {
	            this$1.creativeRef = creativeRef;
	            this$1.CSSPath = payload[creativeRef].CSSPath;
	            this$1.data = payload[creativeRef].instances[0].data;
	            this$1.env = payload[creativeRef].instances[0].env;
	            this$1.creativePath = payload[creativeRef].creativePath;
	            this$1.data.appendPoint = this$1.config.appendPoint;
	          });
	        }
	        // If the ad is adhesion then it wont use the normal append point
	        // container selector.

	        if (this$1.env.adhesion) {
	          this$1.selector = '#f8-adhesion';
	        } else {
	          this$1.selector = (this$1.config.appendPoint) + " .f8" + (this$1.creativeRef);
	        }
	        // Pass the data directly to the ad if we already have it's factory
	        // cached.
	        if (!this$1.awaitingFactory) {
	          return this$1._callCreativeFactory();
	          // Else just script for the ad factory and pass the data too it once
	          // the loaded event has been emited.
	        } else {
	          // Inject the ad factory script and wait for the load event
	          injectScriptFactory(this$1.creativePath);
	        }
	      })
	      .catch(function (reason) {
	        this$1.active = false;
	        reject(reason);
	      });
	  });
	};

	/**
	 * Reloads first destroys the current ad in place then requests new data
	 * from the ad serving API, if the creative ref exists in the factory cache
	 * then it's loaded. If not a new script is injected into the page and once
	 * loaded will be called by the ad.
	 * @return {Promise} Resolve when the ad finishes loading
	 */
	Ad.prototype.reload = function reload () {
	    var this$1 = this;

	  return new es6Promise(function (resolve, reject) {
	    var requestConfig = {
	      slotID: this$1.config.slotID,
	      view: this$1.config.view,
	      clickTrackingRedirect: this$1.config.clickTrackingRedirect,
	      sport: this$1.config.sport,
	      match: this$1.config.match,
	      competitorIDs: this$1.config.competitorIDs,
	      competitors: this$1.config.competitors,
	      competitionIDs: this$1.config.competitionIDs,
	      competitions: this$1.config.competitions,
	      window: this$1.config.window,
	      inApp: this$1.config.inApp,
	      endpoint: this$1.config.endpoint,
	      appendPoint: this$1.config.appendPoint,
	      linkSameWindow: this$1.config.linkSameWindow,
	      url: this$1.config.url,
	      brand: this$1.config.brand
	    };

	    // Request the ad data
	    return requestAdData(requestConfig)
	      .then(function (payload) {
	        // Grab the creative ref from the playload
	        var creativeRef;
	        if (this$1.evo) {
	          creativeRef = payload.products[0].config;
	        } else {
	          creativeRef = Object.keys(payload)[0];
	        }
	        var resolvers = {
	          resolve: resolve,
	          reject: reject
	        };

	        // Save the promises incase they need to be resolved by the inject
	        // script.
	        this$1.loadResolvers = resolvers;
	        // Distroy the current ad in place.
	        this$1.destroy();
	        // If the creative type has changed then switch the ad type and update
	        // the currently set creative ref/creative path in the class.
	        if (creativeRef !== this$1.creativeRef) {
	          this$1.creativeRef = creativeRef;
	          if (this$1.evo) {
	            this$1.creativePath = (payload.env.cdn) + "/" + (payload.products[0].config) + ".js?v=" + (payload.env.version);
	          } else {
	            this$1.creativePath = payload[creativeRef].creativePath;
	          }
	          this$1._switchAdType();
	        }
	        if (this$1.evo) {
	          Object.keys(payload.products).forEach(function (product) {
	            this$1.CSSPath = payload.products[product].skin;
	            this$1.data = payload.products[product].instances[0];
	            this$1.env = payload.env;
	            this$1.data.appendPoint = this$1.config.appendPoint;
	          });
	        } else {
	          Object.keys(payload).forEach(function (creativeRef) {
	            this$1.CSSPath = payload[creativeRef].CSSPath;
	            this$1.data = payload[creativeRef].instances[0].data;
	            this$1.env = payload[creativeRef].instances[0].env;
	            this$1.data.appendPoint = this$1.config.appendPoint;
	          });
	        }

	        // Update the class selector based on the brand being used
	        this$1.selector = (this$1.config.appendPoint) + " .f8" + (this$1.creativeRef);
	        // Finally call the creative factory to create the ad
	        return this$1._callCreativeFactory();
	      })
	      .catch(reject);
	  });
	};

	/**
	 * Removes the ad from the DOM and cleans up any brand scripts added.
	 * @return {Promise} Resolves when finished.
	 */
	Ad.prototype.destroy = function destroy () {
	  // Only distroy the ad if it's currently active
	  if (this.active) {
	    var appEl = document.querySelector(this.selector);
	    // Remove the ad and the brand CSS
	    this.adInstance.destroy();
	    if (!this.evo) { appEl.parentNode.removeChild(appEl); }
	    this.active = false;
	  }
	};

	/**
	 * Swtich ad type changes get the ad factory for the new creative if it exists
	 * in the cache, otherwise it will inject a new script for it and wait for it
	 * load.
	 */
	Ad.prototype._switchAdType = function _switchAdType () {
	  if (this.creativeFactoryCache.exists(this.creativeRef)) {
	    this._setCreativeFactory(this.creativeFactoryCache.get(this.creativeRef));
	  } else {
	    this.awaitingFactory = true;
	    injectScriptFactory(this.creativePath);
	  }
	};

	/**
	 * Takes a creative factory and sets it as the current one in the class and
	 * also sets the state to not be waiting for a creative factory.
	 * @param {Function} creativeFactory is the creative factory you want to set.
	 */
	Ad.prototype._setCreativeFactory = function _setCreativeFactory (creativeFactory) {
	  this.awaitingFactory = false;
	  this.creativeFactory = creativeFactory;
	};

	/**
	 * Calls the currently set creative factory if it's not waiting for one.
	 * @return {Promise} Resolves after the creative has been loaded on to the
	 * page.
	 */
	Ad.prototype._callCreativeFactory = function _callCreativeFactory () {
	    var this$1 = this;

	  if (!this.awaitingFactory) {
	    return this.creativeFactory(
	      this.env,
	      this.data,
	      this.CSSPath,
	      this.window
	    )
	      .then(function (adInstance) {
	        this$1.adInstance = adInstance;
	        this$1.active = true;
	        this$1.loadResolvers.resolve(this$1);
	      })
	      .catch(this.loadResolvers.reject);
	  }

	  return es6Promise.resolve();
	};

	/**
	 * Vaildates the config for the ad class.
	 * @param  {Object} config is the configurations you want to vaildate.
	 * @return {Object}        the vaildated config.
	 */
	function vaildateConfig$1 (config) {
	  if ( config === void 0 ) config = {};

	  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
	    throw invaildeConfig('Missing "endpoint"');
	  }

	  if (
	    typeof config.creativeFactoryCache === 'undefined' ||
	    config.creativeFactoryCache === ''
	  ) {
	    throw invaildeConfig('Missing "creativeFactoryCache"');
	  }

	  if (typeof config.slotID === 'undefined' || config.slotID === '') {
	    throw invaildeConfig('Missing "slotID"');
	  }

	  if (typeof config.appendPoint === 'undefined' || config.appendPoint === '') {
	    throw invaildeConfig('Missing "appendPoint"');
	  }

	  if (typeof config.window === 'undefined' || config.window === '') {
	    throw invaildeConfig('Missing "window"');
	  }

	  if (typeof config.inApp === 'undefined') {
	    config.inApp = false;
	  }

	  if (typeof config.shouldBreakOut === 'undefined') {
	    config.shouldBreakOut = false;
	  }

	  if (typeof config.linkSameWindow === 'undefined') {
	    config.linkSameWindow = false;
	  }

	  if (typeof config.competitorIDs === 'undefined') {
	    config.competitorIDs = [];
	  }

	  if (typeof config.competitors === 'undefined') {
	    config.competitors = [];
	  }

	  if (typeof config.competitionIDs === 'undefined') {
	    config.competitionIDs = [];
	  }

	  if (typeof config.competitions === 'undefined') {
	    config.competitions = [];
	  }

	  if (typeof config.listenOnPushState === 'undefined') {
	    config.listenOnPushState = false;
	  }

	  if (
	    (config.competitors.length !== 0 || config.competitions.length !== 0) &&
	    !config.sport
	  ) {
	    throw invaildeConfig(
	      'Sport is required if "competitions" or "competitors" is passed through in the config'
	    );
	  }

	  return config;
	}

	var Cache = function Cache () {
	  this.cache = {};
	};

	 /**
	* Set a value against a key in the store.
	* @param{String} key is the name that you want to store the data under.
	* @param{*}    value is the data to you want to store.
	*/
	Cache.prototype.put = function put (key, value) {
	  this.cache[key] = value;
	};

	/**
	 * Remove a key/value pair from the store.
	 * @param {String} key is the name of the key you want to remove.
	 */
	Cache.prototype.remove = function remove (key) {
	  if (this.cache[key]) {
	    delete this.cache[key];
	  }
	};

	/**
	 * Retrieve a value from the store using a key.
	 * @param{String} key is the key you want to use to select cache value in
	 *                    the store.
	 * @return {*}        A cached value from the store if it exists.
	 */
	Cache.prototype.get = function get (key) {
	  return this.cache[key];
	};

	/**
	 * Checks if a value exists in the store.
	 * @param{String} key is the key you want to use to check a value exists for.
	 * @return {Boolean}  whether the value exists or not.
	 */
	Cache.prototype.exists = function exists (key) {
	  if (this.cache[key]) {
	    return true;
	  } else {
	    return false;
	  }
	};

	/**
	 * Adds customEvent method to the window if it doesn't already exist.
	 */
	function customEvent () {
	  if (typeof window.CustomEvent === 'function') {
	    return false;
	  }

	  function CustomEvent (event, params) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent('CustomEvent');
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  }

	  CustomEvent.prototype = window.Event.prototype;

	  window.CustomEvent = CustomEvent;
	}

	/**
	 * Monkey patches the pushState function to emit a custome event
	 * "__f8-history-push-state" on call.
	 * @return {Object} Factories to apply and revert the polyfill changes
	 */
	function PolyfillHistoryPushState () {
	  var _historyPushState = window.history.pushState;
	  var historyPushStateEvent = new CustomEvent('__f8-history-push-state');

	  /**
	   * Restores the original "window.history.pushState" method
	   */
	  function restore () {
	    window.history.pushState = _historyPushState;
	  }

	  /**
	   * Applies the event dispatcher to the "history.pushState" method
	   */
	  function fill () {
	    history.pushState = addEventDispatch;
	  }

	  /**
	   * A polyfilled version of the history.pushState" method with the
	   * "__f8-history-push-state" dispatched on call.
	   */
	  function addEventDispatch () {
	    var historyPushState = _historyPushState.apply(this, arguments);
	    window.dispatchEvent(historyPushStateEvent);
	    return historyPushState;
	  }

	  return {
	    restore: restore,
	    fill: fill
	  };
	}

	function objectAssign () {
	  if (typeof Object.assign != 'function') {
	    // Must be writable: true, enumerable: false, configurable: true
	    Object.defineProperty(Object, "assign", {
	      value: function assign (target, varArgs) { // .length of function is 2
	        var arguments$1 = arguments;

	        if (target == null) { // TypeError if undefined or null
	          throw new TypeError('Cannot convert undefined or null to object');
	        }

	        var to = Object(target);

	        for (var index = 1; index < arguments.length; index++) {
	          var nextSource = arguments$1[index];

	          if (nextSource != null) { // Skip over if undefined or null
	            for (var nextKey in nextSource) {
	              // Avoid bugs when hasOwnProperty is shadowed
	              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
	                to[nextKey] = nextSource[nextKey];
	              }
	            }
	          }
	        }
	        return to;
	      },
	      writable: true,
	      configurable: true
	    });
	  }
	}

	objectAssign();

	var version = '1.0.0';

	var Fresh8 = function Fresh8 (config) {
	  // Ad class
	  this.Ad = Ad;
	  // Adds polyfills for custome events.
	  customEvent();
	  // The vaildated user config.
	  this.config = vaildateConfig(config);
	  // The window that should be used to append the ad to.
	  this.window = getWindow(this.config.shouldBreakOut);
	  // A store for the currently loaded ads.
	  this.ads = [];
	  // Cache for the creative factories.
	  this.creativeFactoryCache = new Cache();
	  // Bind the "__f8" object to the current window. This is rquired by our ad
	  // factories.
	  bindf8ToWindow(version, this.window);
	  // Bind the global event listener that's fired when the ad factory is loaded.
	  this._addEventLisnters();
	  // Bind a custome event for push state changes.
	  if (this.config.listenOnPushState) {
	    this.polyfillHistoryPushState = new PolyfillHistoryPushState();
	    this.polyfillHistoryPushState.fill();
	  }
	};

	/**
	 * Request an ad by slot ID, this ad will be appended to the "appendPoint"
	 * @param{Object} config defines want data you want to pass to the Fresh8
	 *                       ad system when injecting your ad. E.G.
	 *                       { slotID: 'f8-001' - required
	 *                       , url: 'http://fresh8gaming.com'
	 *                       , appendPoint: 'body' - required
	 *                       , view: 'home-page' - optional
	 *                       , clickTrackingRedirect: 'http://dfp.com?r='- optional
	 *                       , sport: 'football' - optional
	 *                       , matchID: '85623' - optional Opta ID
	 *                       , competitorIDs: ['55436'] - optional Opta ID's
	 *                       , competitors: ['Manchester United', 'Southampton'] - optinal
	 *                       , competitionIDs: ['1245'] - optional Opta ID's
	 *                       , competitions: ['Premier League'] - optional
	 *                       , brand: 'my-brand-name' - optional
	 *                       }
	 *                       For more details on these options please refer to
	 *                       the readme.
	 * @return {Promise}     This is resolved or rejected based on if the ad
	 *                       loaded successfully or not.
	 */
	Fresh8.prototype.requestAd = function requestAd (config) {
	    var this$1 = this;
	    if ( config === void 0 ) config = {};

	  return new es6Promise(function (resolve) {
	    // Add Fresh8 class data to request ad config
	    config.endpoint = this$1.config.endpoint;
	    config.window = this$1.window;
	    config.creativeFactoryCache = this$1.creativeFactoryCache;
	    // Create a new ad and
	    var ad = new this$1.Ad(config);

	    // Store the ad for reference
	    this$1.ads.push(ad);
	    // Load the ad a return the promise
	    return resolve(ad.load());
	  });
	};

	/**
	 * Cleans up any event lisnters/ads added by the class
	 */
	Fresh8.prototype.remove = function remove () {
	  // Remove any added event lisnters
	  this._removeEventLisnters();
	  // Remove all the ads from the page
	  this.destroyAllAds();
	  // Restore the patch history push state
	  if (this.config.listenOnPushState) {
	    this.polyfillHistoryPushState.restore();
	  }
	};

	/**
	 * Reloads all the currently active ads on the page
	 * @return {Promise} containing references to the new ads
	 */
	Fresh8.prototype.reloadAllAds = function reloadAllAds () {
	  var activeAds = this.ads.filter(function (ad) { return ad.active; });
	  return es6Promise.all(activeAds.map(function (ad) { return ad.reload(); }));
	};

	/**
	 * Destroys all currently active ads on the page
	 * @return {Promise} resolves on completion
	 */
	Fresh8.prototype.destroyAllAds = function destroyAllAds () {
	  var activeAds = this.ads.filter(function (ad) { return ad.active; });
	  return es6Promise.all(activeAds.map(function (ad) { return ad.destroy(); }));
	};

	/**
	 * Adds the "__f8-creative-script-loaded" and "__f8-history-push-state" event
	 * lisnters to the window
	 */
	Fresh8.prototype._addEventLisnters = function _addEventLisnters () {
	  this.boundOnCreativeLoaded = this._onCreativeLoaded.bind(this);
	  this.boundOnHistoryPushStateChange = this._onHistoryPushStateChange.bind(
	    this
	  );
	  this.window.addEventListener(
	    '__f8-creative-script-loaded',
	    this.boundOnCreativeLoaded
	  );
	  this.window.addEventListener(
	    '__f8-product-script-loaded',
	    this.boundOnCreativeLoaded
	  );
	  this.window.addEventListener(
	    '__f8-history-push-state',
	    this.boundOnHistoryPushStateChange
	  );
	};

	/**
	 * Removes the "__f8-creative-script-loaded" and "__f8-history-push-state" event
	 * lisnters from the window
	 */
	Fresh8.prototype._removeEventLisnters = function _removeEventLisnters () {
	  this.window.removeEventListener(
	    '__f8-creative-script-loaded',
	    this.boundOnCreativeLoaded
	  );
	  this.window.removeEventListener(
	    '__f8-product-script-loaded',
	    this.boundOnCreativeLoaded
	  );
	  this.window.removeEventListener(
	    '__f8-history-push-state',
	    this.boundOnHistoryPushStateChange
	  );
	};

	/**
	 * Handler for the script loaded event and set the creative factory on any
	 * ads that match the creative ref and are waiting for a creativeFactory.
	 * @param {Object} event is a custom event object
	 */
	Fresh8.prototype._onCreativeLoaded = function _onCreativeLoaded (event) {
	  // Cache the creative factory so we can re used it for other ads
	  this.creativeFactoryCache.put(event.creativeRef, event.creativeFactory);
	  // Loop over the ads and check if any that require a creative factory
	  // with the matching creative ref
	  this.ads.forEach(function (ad) {
	    if (ad.evo) {
	      if (ad.awaitingFactory && event.config === ad.creativeRef) {
	        // Set the creative factory
	        ad._setCreativeFactory(event.productFactory);
	        // Call the creative factory loading the ad onto the page
	        ad._callCreativeFactory();
	      }
	    } else {
	      if (ad.awaitingFactory && event.creativeRef === ad.creativeRef) {
	        // Set the creative factory
	        ad._setCreativeFactory(event.creativeFactory);
	        // Call the creative factory loading the ad onto the page
	        ad._callCreativeFactory();
	      }
	    }
	  });
	};

	/**
	 * Handels the push state change event that reloads all the currently active
	 * ads on the page
	 */
	Fresh8.prototype._onHistoryPushStateChange = function _onHistoryPushStateChange () {
	  this.reloadAllAds().catch();
	};

	// Check if the "Fresh8" object has already been bound to the window.
	if (!window.Fresh8) {
	  window.Fresh8 = Fresh8;
	}

})));
//# sourceMappingURL=browser.js.map
