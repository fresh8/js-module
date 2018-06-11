(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Fresh8"] = factory();
	else
		root["Fresh8"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(5);
	
	var _ad = __webpack_require__(6);
	
	var _ad2 = _interopRequireDefault(_ad);
	
	var _cache = __webpack_require__(10);
	
	var _cache2 = _interopRequireDefault(_cache);
	
	var _polyfill = __webpack_require__(11);
	
	var _util = __webpack_require__(8);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var version = '1.0.0';
	
	var Fresh8 = function () {
	  /**
	   * Fresh8 is a class that handles the injection of Fresh8 ads into a target
	   * based on slot ID.
	   * @param {Object} config is the global instance configurations E.G.
	   *                        { instID: '54ad56a213fe19232b646047'
	   *                        , shouldBreakOut: false  - optinal
	   *                        , listenOnPushState: false - optinal
	   *                        , inApp: false - optional
	   *                        , endpoint: '' - optional
	   *                        }
	   *                        For more details on these options please refer to
	   *                        the readme.
	   */
	  function Fresh8(config) {
	    _classCallCheck(this, Fresh8);
	
	    // Ad class
	    this.Ad = _ad2.default;
	    // Adds polyfills for custome events.
	    (0, _polyfill.customEvent)();
	    // The vaildated user config.
	    this.config = (0, _util.vaildateConfig)(config);
	    // The window that should be used to append the ad to.
	    this.window = (0, _util.getWindow)(this.config.shouldBreakOut);
	    // A store for the currently loaded ads.
	    this.ads = [];
	    // Cache for the creative factories.
	    this.creativeFactoryCache = new _cache2.default();
	    // Bind the "__f8" object to the current window. This is rquired by our ad
	    // factories.
	    (0, _util.bindf8ToWindow)(version, this.window);
	    // Bind the global event listener that's fired when the ad factory is loaded.
	    this._addEventLisnters();
	    // Bind a custome event for push state changes.
	    if (this.config.listenOnPushState) {
	      this.polyfillHistoryPushState = new _polyfill.PolyfillHistoryPushState();
	      this.polyfillHistoryPushState.fill();
	    }
	  }
	
	  /**
	   * Request an ad by slot ID, this ad will be appended to the "appendPoint"
	   * @param  {Object} config defines want data you want to pass to the Fresh8
	   *                         ad system when injecting your ad. E.G.
	   *                         { slotID: 'f8-001' - required
	   *                         , url: 'http://fresh8gaming.com'
	   *                         , appendPoint: 'body' - required
	   *                         , view: 'home-page' - optional
	   *                         , clickTrackingRedirect: 'http://dfp.com?r='  - optional
	   *                         , sport: 'football' - optional
	   *                         , matchID: '85623' - optional Opta ID
	   *                         , competitorIDs: ['55436'] - optional Opta ID's
	   *                         , competitors: ['Manchester United', 'Southampton'] - optinal
	   *                         , competitionIDs: ['1245'] - optional Opta ID's
	   *                         , competitions: ['Premier League'] - optional
	   *                         , brand: 'my-brand-name' - optional
	   *                         }
	   *                         For more details on these options please refer to
	   *                         the readme.
	   * @return {Promise}       This is resolved or rejected based on if the ad
	   *                         loaded successfully or not.
	   */
	
	
	  _createClass(Fresh8, [{
	    key: 'requestAd',
	    value: function requestAd() {
	      var _this = this;
	
	      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      return new Promise(function (resolve) {
	        // Add Fresh8 class data to request ad config
	        config.endpoint = _this.config.endpoint;
	        config.window = _this.window;
	        config.creativeFactoryCache = _this.creativeFactoryCache;
	        // Create a new ad and
	        var ad = new _this.Ad(config);
	        // Store the ad for reference
	        _this.ads.push(ad);
	        // Load the ad a return the promise
	        return resolve(ad.load());
	      });
	    }
	
	    /**
	     * Cleans up any event lisnters/ads added by the class
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove() {
	      // Remove any added event lisnters
	      this._removeEventLisnters();
	      // Remove all the ads from the page
	      this.destroyAllAds();
	      // Restore the patch history push state
	      if (this.config.listenOnPushState) {
	        this.polyfillHistoryPushState.restore();
	      }
	    }
	
	    /**
	     * Reloads all the currently active ads on the page
	     * @return {Promise} containing references to the new ads
	     */
	
	  }, {
	    key: 'reloadAllAds',
	    value: function reloadAllAds() {
	      var activeAds = this.ads.filter(function (ad) {
	        return ad.active;
	      });
	      return Promise.all(activeAds.map(function (ad) {
	        return ad.reload();
	      }));
	    }
	
	    /**
	     * Destroys all currently active ads on the page
	     * @return {Promise} resolves on completion
	     */
	
	  }, {
	    key: 'destroyAllAds',
	    value: function destroyAllAds() {
	      var activeAds = this.ads.filter(function (ad) {
	        return ad.active;
	      });
	      return Promise.all(activeAds.map(function (ad) {
	        return ad.destroy();
	      }));
	    }
	
	    /**
	     * Adds the "__f8-creative-script-loaded" and "__f8-history-push-state" event
	     * lisnters to the window
	     */
	
	  }, {
	    key: '_addEventLisnters',
	    value: function _addEventLisnters() {
	      this.boundOnCreativeLoaded = this._onCreativeLoaded.bind(this);
	      this.boundOnHistoryPushStateChange = this._onHistoryPushStateChange.bind(this);
	      this.window.addEventListener('__f8-creative-script-loaded', this.boundOnCreativeLoaded);
	      this.window.addEventListener('__f8-history-push-state', this.boundOnHistoryPushStateChange);
	    }
	
	    /**
	     * Removes the "__f8-creative-script-loaded" and "__f8-history-push-state" event
	     * lisnters from the window
	     */
	
	  }, {
	    key: '_removeEventLisnters',
	    value: function _removeEventLisnters() {
	      this.window.removeEventListener('__f8-creative-script-loaded', this.boundOnCreativeLoaded);
	      this.window.removeEventListener('__f8-history-push-state', this.boundOnHistoryPushStateChange);
	    }
	
	    /**
	     * Handler for the script loaded event and set the creative factory on any
	     * ads that match the creative ref and are waiting for a creativeFactory.
	     * @param {Object} event is a custom event object
	     */
	
	  }, {
	    key: '_onCreativeLoaded',
	    value: function _onCreativeLoaded(event) {
	      // Cache the creative factory so we can re used it for other ads
	      this.creativeFactoryCache.put(event.creativeRef, event.creativeFactory);
	
	      // Loop over the ads and check if any that require a creative factory
	      // with the matching creative ref
	      this.ads.forEach(function (ad) {
	        if (ad.awaitingFactory && event.creativeRef === ad.creativeRef) {
	          // Set the creative factory
	          ad._setCreativeFactory(event.creativeFactory);
	          // Call the creative factory loading the ad onto the page
	          ad._callCreativeFactory();
	        }
	      });
	    }
	
	    /**
	     * Handels the push state change event that reloads all the currently active
	     * ads on the page
	     */
	
	  }, {
	    key: '_onHistoryPushStateChange',
	    value: function _onHistoryPushStateChange() {
	      this.reloadAllAds().catch();
	    }
	  }]);
	
	  return Fresh8;
	}();
	
	exports.default = Fresh8;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, Promise, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   3.3.1
	 */
	
	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.ES6Promise = factory());
	}(this, (function () { 'use strict';
	
	function objectOrFunction(x) {
	  return typeof x === 'function' || typeof x === 'object' && x !== null;
	}
	
	function isFunction(x) {
	  return typeof x === 'function';
	}
	
	var _isArray = undefined;
	if (!Array.isArray) {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	} else {
	  _isArray = Array.isArray;
	}
	
	var isArray = _isArray;
	
	var len = 0;
	var vertxNext = undefined;
	var customSchedulerFn = undefined;
	
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
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';
	
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
	  return function () {
	    vertxNext(flush);
	  };
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
	    var r = require;
	    var vertx = __webpack_require__(4);
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}
	
	var scheduleFlush = undefined;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}
	
	function then(onFulfillment, onRejection) {
	  var _arguments = arguments;
	
	  var parent = this;
	
	  var child = new this.constructor(noop);
	
	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }
	
	  var _state = parent._state;
	
	  if (_state) {
	    (function () {
	      var callback = _arguments[_state - 1];
	      asap(function () {
	        return invokeCallback(_state, child, callback, parent._result);
	      });
	    })();
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
	function resolve(object) {
	  /*jshint validthis:true */
	  var Constructor = this;
	
	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }
	
	  var promise = new Constructor(noop);
	  _resolve(promise, object);
	  return promise;
	}
	
	var PROMISE_ID = Math.random().toString(36).substring(16);
	
	function noop() {}
	
	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	
	var GET_THEN_ERROR = new ErrorObject();
	
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
	    GET_THEN_ERROR.error = error;
	    return GET_THEN_ERROR;
	  }
	}
	
	function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}
	
	function handleForeignThenable(promise, thenable, then) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        _resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	
	      _reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	    if (!sealed && error) {
	      sealed = true;
	      _reject(promise, error);
	    }
	  }, promise);
	}
	
	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    _reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return _resolve(promise, value);
	    }, function (reason) {
	      return _reject(promise, reason);
	    });
	  }
	}
	
	function handleMaybeThenable(promise, maybeThenable, then$$) {
	  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$ === GET_THEN_ERROR) {
	      _reject(promise, GET_THEN_ERROR.error);
	    } else if (then$$ === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$)) {
	      handleForeignThenable(promise, maybeThenable, then$$);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}
	
	function _resolve(promise, value) {
	  if (promise === value) {
	    _reject(promise, selfFulfillment());
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
	
	function _reject(promise, reason) {
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
	
	  var child = undefined,
	      callback = undefined,
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
	
	function ErrorObject() {
	  this.error = null;
	}
	
	var TRY_CATCH_ERROR = new ErrorObject();
	
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
	      value = undefined,
	      error = undefined,
	      succeeded = undefined,
	      failed = undefined;
	
	  if (hasCallback) {
	    value = tryCatch(callback, detail);
	
	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value = null;
	    } else {
	      succeeded = true;
	    }
	
	    if (promise === value) {
	      _reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }
	
	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	}
	
	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      _resolve(promise, value);
	    }, function rejectPromise(reason) {
	      _reject(promise, reason);
	    });
	  } catch (e) {
	    _reject(promise, e);
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
	
	function Enumerator(Constructor, input) {
	  this._instanceConstructor = Constructor;
	  this.promise = new Constructor(noop);
	
	  if (!this.promise[PROMISE_ID]) {
	    makePromise(this.promise);
	  }
	
	  if (isArray(input)) {
	    this._input = input;
	    this.length = input.length;
	    this._remaining = input.length;
	
	    this._result = new Array(this.length);
	
	    if (this.length === 0) {
	      fulfill(this.promise, this._result);
	    } else {
	      this.length = this.length || 0;
	      this._enumerate();
	      if (this._remaining === 0) {
	        fulfill(this.promise, this._result);
	      }
	    }
	  } else {
	    _reject(this.promise, validationError());
	  }
	}
	
	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	};
	
	Enumerator.prototype._enumerate = function () {
	  var length = this.length;
	  var _input = this._input;
	
	  for (var i = 0; this._state === PENDING && i < length; i++) {
	    this._eachEntry(_input[i], i);
	  }
	};
	
	Enumerator.prototype._eachEntry = function (entry, i) {
	  var c = this._instanceConstructor;
	  var resolve$$ = c.resolve;
	
	  if (resolve$$ === resolve) {
	    var _then = getThen(entry);
	
	    if (_then === then && entry._state !== PENDING) {
	      this._settledAt(entry._state, i, entry._result);
	    } else if (typeof _then !== 'function') {
	      this._remaining--;
	      this._result[i] = entry;
	    } else if (c === Promise) {
	      var promise = new c(noop);
	      handleMaybeThenable(promise, entry, _then);
	      this._willSettleAt(promise, i);
	    } else {
	      this._willSettleAt(new c(function (resolve$$) {
	        return resolve$$(entry);
	      }), i);
	    }
	  } else {
	    this._willSettleAt(resolve$$(entry), i);
	  }
	};
	
	Enumerator.prototype._settledAt = function (state, i, value) {
	  var promise = this.promise;
	
	  if (promise._state === PENDING) {
	    this._remaining--;
	
	    if (state === REJECTED) {
	      _reject(promise, value);
	    } else {
	      this._result[i] = value;
	    }
	  }
	
	  if (this._remaining === 0) {
	    fulfill(promise, this._result);
	  }
	};
	
	Enumerator.prototype._willSettleAt = function (promise, i) {
	  var enumerator = this;
	
	  subscribe(promise, undefined, function (value) {
	    return enumerator._settledAt(FULFILLED, i, value);
	  }, function (reason) {
	    return enumerator._settledAt(REJECTED, i, reason);
	  });
	};
	
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
	function reject(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  _reject(promise, reason);
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
	  @param {function} resolver
	  Useful for tooling.
	  @constructor
	*/
	function Promise(resolver) {
	  this[PROMISE_ID] = nextId();
	  this._result = this._state = undefined;
	  this._subscribers = [];
	
	  if (noop !== resolver) {
	    typeof resolver !== 'function' && needsResolver();
	    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	  }
	}
	
	Promise.all = all;
	Promise.race = race;
	Promise.resolve = resolve;
	Promise.reject = reject;
	Promise._setScheduler = setScheduler;
	Promise._setAsap = setAsap;
	Promise._asap = asap;
	
	Promise.prototype = {
	  constructor: Promise,
	
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
	  then: then,
	
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
	  'catch': function _catch(onRejection) {
	    return this.then(null, onRejection);
	  }
	};
	
	function polyfill() {
	    var local = undefined;
	
	    if (typeof global !== 'undefined') {
	        local = global;
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
	
	    local.Promise = Promise;
	}
	
	polyfill();
	// Strange compat..
	Promise.polyfill = polyfill;
	Promise.Promise = Promise;
	
	return Promise;
	
	})));
	//# sourceMappingURL=es6-promise.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(2), (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Promise) {(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
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
	    ]
	
	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }
	
	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }
	
	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)
	
	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }
	
	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }
	
	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }
	
	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	
	    if (typeof input === 'string') {
	      this.url = input
	    } else {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split('\r\n').forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.vaildateConfig = vaildateConfig;
	
	var _api = __webpack_require__(7);
	
	var _util = __webpack_require__(8);
	
	var _errors = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Ad = function () {
	  /**
	   * A class for managing and loading a single ad
	   * @param {Object} config is the configurations used to make the API reqeuest
	   *                        { slotID: 'f8-001'
	   *                        , creativeFactoryCache: new Cache() - used for
	   *                          global cache factory look ups
	   *                       , view: 'home-page' - optional
	   *                       , clickTrackingRedirect: 'http://dfp.com?r=' - optional
	   *                       , sport: 'football' - optional
	   *                       , matchID: '85623' - optional Opta ID
	   *                       , competitorIDs: ['55436'] - optional Opta ID's
	   *                       , competitors: ['Manchester United', 'Southampton'] - optinal
	   *                       , competitionIDs: ['1245'] - optional Opta ID's
	   *                       , competitions: ['Premier League'] - optional
	   *                       , window: the window used to extra the page ref from
	   *                       , inApp: false - optional
	   *                       , endpoint: '' - optional
	   *                       , appendPoint: 'body' - required
	   *                       , linkSameWindow: true - optional
	   *                       , brand: 'my-brand-name' - optional
	   *                       , url: 'http://fresh8gaming.com' - optional
	   *                       }
	   */
	  function Ad() {
	    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Ad);
	
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
	    this.config = vaildateConfig(config);
	    // creativeFactoryCache is the global cache for the creative factories.
	    this.creativeFactoryCache = config.creativeFactoryCache;
	    // window is a refernce to the window object used when make API requests.
	    this.window = config.window;
	  }
	
	  /**
	   * Fetches the data for the ad and loads the ad on the page while updating a
	   * lot the ad's state.
	   * @return {Promise} Resolve when the ad finishes loading and returns an
	   *                   instance of the ad class.
	   */
	
	
	  _createClass(Ad, [{
	    key: 'load',
	    value: function load() {
	      var _this = this;
	
	      return new Promise(function (resolve, reject) {
	        // Construct the object for the request data
	        var requestConfig = {
	          slotID: _this.config.slotID,
	          view: _this.config.view,
	          clickTrackingRedirect: _this.config.clickTrackingRedirect,
	          sport: _this.config.sport,
	          match: _this.config.match,
	          competitorIDs: _this.config.competitorIDs,
	          competitors: _this.config.competitors,
	          competitionIDs: _this.config.competitionIDs,
	          competitions: _this.config.competitions,
	          window: _this.config.window,
	          inApp: _this.config.inApp,
	          endpoint: _this.config.endpoint,
	          appendPoint: _this.config.appendPoint,
	          linkSameWindow: _this.config.linkSameWindow,
	          url: _this.config.url
	        };
	
	        // Make the API request to the ad server
	        (0, _api.requestAdData)(requestConfig).then(function (payload) {
	          var resolvers = {
	            resolve: resolve,
	            reject: reject
	          };
	
	          // Save the promise so it can be revoled after the creative script
	          // has loaded.
	          _this.loadResolvers = resolvers;
	
	          // Inject the scripts for each ad.
	          Object.keys(payload).forEach(function (creativeRef) {
	            _this.creativeRef = creativeRef;
	            _this.CSSPath = payload[creativeRef].CSSPath;
	            _this.data = payload[creativeRef].instances[0].data;
	            _this.env = payload[creativeRef].instances[0].env;
	            _this.creativePath = payload[creativeRef].creativePath;
	            _this.data.appendPoint = _this.config.appendPoint;
	
	            // If the ad is adhesion then it wont use the normal append point
	            // container selector.
	            if (_this.env.adhesion) {
	              _this.selector = '#f8-adhesion';
	            } else {
	              _this.selector = _this.config.appendPoint + ' .f8' + _this.creativeRef;
	            }
	
	            // Pass the data directly to the ad if we already have it's factory
	            // cached.
	            if (!_this.awaitingFactory) {
	              _this._callCreativeFactory();
	              // Else just script for the ad factory and pass the data too it once
	              // the loaded event has been emited.
	            } else {
	              // Inject the ad factory script and wait for the load event
	              (0, _util.injectScriptFactory)(_this.creativePath);
	            }
	          });
	        }).catch(function (reason) {
	          _this.active = false;
	          reject(reason);
	        });
	      });
	    }
	
	    /**
	     * Reloads first destroys the current ad in place then requests new data
	     * from the ad serving API, if the creative ref exists in the factory cache
	     * then it's loaded. If not a new script is injected into the page and once
	     * loaded will be called by the ad.
	     * @return {Promise} Resolve when the ad finishes loading
	     */
	
	  }, {
	    key: 'reload',
	    value: function reload() {
	      var _this2 = this;
	
	      return new Promise(function (resolve, reject) {
	        var requestConfig = {
	          slotID: _this2.config.slotID,
	          view: _this2.config.view,
	          clickTrackingRedirect: _this2.config.clickTrackingRedirect,
	          sport: _this2.config.sport,
	          match: _this2.config.match,
	          competitorIDs: _this2.config.competitorIDs,
	          competitors: _this2.config.competitors,
	          competitionIDs: _this2.config.competitionIDs,
	          competitions: _this2.config.competitions,
	          window: _this2.config.window,
	          inApp: _this2.config.inApp,
	          endpoint: _this2.config.endpoint,
	          appendPoint: _this2.config.appendPoint,
	          linkSameWindow: _this2.config.linkSameWindow,
	          url: _this2.config.url
	        };
	
	        // Request the ad data
	        (0, _api.requestAdData)(requestConfig).then(function (payload) {
	          // Grab the creative ref from the playload
	          var creativeRef = Object.keys(payload)[0];
	          var resolvers = {
	            resolve: resolve,
	            reject: reject
	          };
	
	          // Save the promises incase they need to be resolved by the inject
	          // script.
	          _this2.loadResolvers = resolvers;
	          // Distroy the current ad in place.
	          _this2.destroy();
	          // If the creative type has changed then switch the ad type and update
	          // the currently set creative ref/creative path in the class.
	          if (creativeRef !== _this2.creativeRef) {
	            _this2.creativeRef = creativeRef;
	            _this2.creativePath = payload[creativeRef].creativePath;
	            _this2._switchAdType();
	          }
	
	          // Update the data state.
	          _this2.data = payload[_this2.creativeRef].instances[0].data;
	          // Update the env data.
	          _this2.env = payload[_this2.creativeRef].instances[0].env;
	          // Update the CSS file path.
	          _this2.CSSPath = payload[_this2.creativeRef].CSSPath;
	          // Force the append point in the data to match the one that the class
	          // is using.
	          _this2.data.appendPoint = _this2.config.appendPoint;
	          // Update the class selector based on the brand being used
	          _this2.selector = _this2.config.appendPoint + ' .f8' + _this2.creativeRef;
	          // Finally call the creative factory to create the ad
	          return _this2._callCreativeFactory();
	        }).catch(reject);
	      });
	    }
	
	    /**
	     * Removes the ad from the DOM and cleans up any brand scripts added.
	     * @return {Promise} Resolves when finished.
	     */
	
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      // Only distroy the ad if it's currently active
	      if (this.active) {
	        var appEl = document.querySelector(this.selector);
	        // Remove the ad and the brand CSS
	        this.adInstance.destroy();
	        appEl.parentNode.removeChild(appEl);
	        this.active = false;
	      }
	    }
	
	    /**
	     * Swtich ad type changes get the ad factory for the new creative if it exists
	     * in the cache, otherwise it will inject a new script for it and wait for it
	     * load.
	     */
	
	  }, {
	    key: '_switchAdType',
	    value: function _switchAdType() {
	      if (this.creativeFactoryCache.exists(this.creativeRef)) {
	        this._setCreativeFactory(this.creativeFactoryCache.get(this.creativeRef));
	      } else {
	        this.awaitingFactory = true;
	        (0, _util.injectScriptFactory)(this.creativePath);
	      }
	    }
	
	    /**
	     * Takes a creative factory and sets it as the current one in the class and
	     * also sets the state to not be waiting for a creative factory.
	     * @param {Function} creativeFactory is the creative factory you want to set.
	     */
	
	  }, {
	    key: '_setCreativeFactory',
	    value: function _setCreativeFactory(creativeFactory) {
	      this.awaitingFactory = false;
	      this.creativeFactory = creativeFactory;
	    }
	
	    /**
	     * Calls the currently set creative factory if it's not waiting for one.
	     * @return {Promise} Resolves after the creative has been loaded on to the
	     * page.
	     */
	
	  }, {
	    key: '_callCreativeFactory',
	    value: function _callCreativeFactory() {
	      var _this3 = this;
	
	      if (!this.awaitingFactory) {
	        return this.creativeFactory(this.env, this.data, this.CSSPath, this.window).then(function (adInstance) {
	          _this3.adInstance = adInstance;
	          _this3.active = true;
	          _this3.loadResolvers.resolve(_this3);
	        }).catch(this.loadResolvers.reject);
	      }
	
	      return Promise.resolve();
	    }
	  }]);
	
	  return Ad;
	}();
	
	/**
	 * Vaildates the config for the ad class.
	 * @param  {Object} config is the configurations you want to vaildate.
	 * @return {Object}        the vaildated config.
	 */
	
	
	exports.default = Ad;
	function vaildateConfig() {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
	    throw (0, _errors.invaildeConfig)('Missing "endpoint"');
	  }
	
	  if (typeof config.creativeFactoryCache === 'undefined' || config.creativeFactoryCache === '') {
	    throw (0, _errors.invaildeConfig)('Missing "creativeFactoryCache"');
	  }
	
	  if (typeof config.slotID === 'undefined' || config.slotID === '') {
	    throw (0, _errors.invaildeConfig)('Missing "slotID"');
	  }
	
	  if (typeof config.appendPoint === 'undefined' || config.appendPoint === '') {
	    throw (0, _errors.invaildeConfig)('Missing "appendPoint"');
	  }
	
	  if (typeof config.window === 'undefined' || config.window === '') {
	    throw (0, _errors.invaildeConfig)('Missing "window"');
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
	
	  if ((config.competitors.length !== 0 || config.competitions.length !== 0) && !config.sport) {
	    throw (0, _errors.invaildeConfig)('Sport is required if "competitions" or "competitors" is passed through in the config');
	  }
	
	  return config;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.requestAdData = requestAdData;
	exports.checkStatusCode = checkStatusCode;
	exports.parseJSON = parseJSON;
	exports.constructRequestURL = constructRequestURL;
	exports.vaildateRequestAdConf = vaildateRequestAdConf;
	exports.buildQueryString = buildQueryString;
	
	var _util = __webpack_require__(8);
	
	var _errors = __webpack_require__(9);
	
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
	function requestAdData(config) {
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
	    ref: (0, _util.getRef)(vaildatedConfig.window, vaildatedConfig.inApp, vaildatedConfig.url)
	  });
	
	  return fetch(endpoint, { credentials: 'include' }).then(checkStatusCode).then(parseJSON);
	}
	
	/**
	 * Checks the stats code on a response and rejects the promise chain if
	 * less than 200 or greater than 300.
	 * @param  {Object} response is the fetch response object
	 * @return {(Promise.reject|Object)} a rejected promise or the reponse object
	 */
	function checkStatusCode(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response;
	  }
	
	  return Promise.reject('Server returned error: ' + response.status);
	}
	
	/**
	 * Returns the json from a fetch request
	 * @param  {Object} response is the fetch response object
	 * @return {Object} the parsed JSON object
	 */
	function parseJSON(response) {
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
	function constructRequestURL(url) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	  var queryStringsOptions = _extends({}, options);
	
	  if (typeof queryStringsOptions.competitorIds !== 'undefined') {
	    queryStringsOptions.competitorIds = queryStringsOptions.competitorIds.map(function (value) {
	      return encodeURIComponent(value);
	    });
	  }
	
	  if (typeof queryStringsOptions.competitors !== 'undefined') {
	    queryStringsOptions.competitors = queryStringsOptions.competitors.map(function (value) {
	      return encodeURIComponent(value);
	    });
	  }
	
	  if (typeof queryStringsOptions.competitionIds !== 'undefined') {
	    queryStringsOptions.competitionIds = queryStringsOptions.competitionIds.map(function (value) {
	      return encodeURIComponent(value);
	    });
	  }
	
	  if (typeof queryStringsOptions.competitions !== 'undefined') {
	    queryStringsOptions.competitions = queryStringsOptions.competitions.map(function (value) {
	      return encodeURIComponent(value);
	    });
	  }
	
	  var queryString = buildQueryString(queryStringsOptions);
	
	  return url + queryString;
	}
	
	/**
	 * Takes a requestAd conf object and vaildates it
	 * @param  {Object} config is the user defined config object
	 * @return {Object}        the vaildated object
	 */
	function vaildateRequestAdConf() {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
	    throw (0, _errors.invaildeConfig)('Missing "endpoint"');
	  }
	
	  if (typeof config.slotID === 'undefined' || config.slotID === '') {
	    throw (0, _errors.invaildeConfig)('Missing "slotID"');
	  }
	
	  if (typeof config.window === 'undefined' || config.window === '') {
	    throw (0, _errors.invaildeConfig)('Missing "window"');
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
	
	  if ((config.competitors.length !== 0 || config.competitions.length !== 0) && !config.sport) {
	    throw (0, _errors.invaildeConfig)('Sport is required if "competitions" or "competitors" is passed through in the config');
	  }
	
	  return config;
	}
	
	/**
	 * Takes a dictionary and converts it to a queryString
	 * @param  {Object} dictionary is a dictionary of string key's to
	 *                             string values.
	 * @return {String} a queryString in the form of `?key=val&keyTwo=valTwo`.
	 */
	function buildQueryString(options) {
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getWindow = getWindow;
	exports.getRef = getRef;
	exports.bindf8ToWindow = bindf8ToWindow;
	exports.injectScriptFactory = injectScriptFactory;
	exports.vaildateConfig = vaildateConfig;
	
	var _errors = __webpack_require__(9);
	
	/**
	 * Returns the window object that this script should inject into
	 * @param  {Boolean} shouldBreak is whether or not the script should attempt
	 *                               to break from iframe.
	 * @return {Window} the working window
	 */
	function getWindow(shouldBreak) {
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
	function getRef(window, inApp, userOverrideRef) {
	  if (userOverrideRef && typeof userOverrideRef !== 'undefined' && userOverrideRef !== '') {
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
	function bindf8ToWindow(version, targetWindow) {
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
	      throw new Error('Trying to access f8 v' + version + ' property ' + key + ', but its not defined');
	    }
	  };
	}
	
	/**
	 * Injects a script tag onto the page
	 * @param  {String} creativeSource is the URL for the script you want to append
	 *                                 to the page.
	 */
	function injectScriptFactory(creativeSource) {
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
	function vaildateConfig() {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  if (typeof config.instID === 'undefined' || config.instID === '') {
	    throw (0, _errors.invaildeConfig)('Missing "instID" in config');
	  }
	
	  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
	    config.endpoint = 'https://fresh8.co/' + config.instID + '/raw';
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

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.invaildeConfig = invaildeConfig;
	/**
	 * Invailde config
	 * @param  {String} message is discription you want to add to the error.
	 * @return {Error}          a new error with the correct name and message.
	 */
	function invaildeConfig(message) {
	  var error = new Error(message);
	  error.name = 'invaildeConfig';
	  return error;
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cache = function () {
	  /**
	   * A basic cache store class
	   */
	  function Cache() {
	    _classCallCheck(this, Cache);
	
	    this.cache = {};
	  }
	
	  /**
	   * Set a value against a key in the store.
	   * @param  {String} key   is the name that you want to store the data under.
	   * @param  {*}      value is the data to you want to store.
	   */
	
	
	  _createClass(Cache, [{
	    key: "put",
	    value: function put(key, value) {
	      this.cache[key] = value;
	    }
	
	    /**
	     * Remove a key/value pair from the store.
	     * @param {String} key is the name of the key you want to remove.
	     */
	
	  }, {
	    key: "remove",
	    value: function remove(key) {
	      if (this.cache[key]) {
	        delete this.cache[key];
	      }
	    }
	
	    /**
	     * Retrieve a value from the store using a key.
	     * @param  {String} key is the key you want to use to select cache value in
	     *                      the store.
	     * @return {*}          A cached value from the store if it exists.
	     */
	
	  }, {
	    key: "get",
	    value: function get(key) {
	      return this.cache[key];
	    }
	
	    /**
	     * Checks if a value exists in the store.
	     * @param  {String} key is the key you want to use to check a value exists for.
	     * @return {Boolean}    whether the value exists or not.
	     */
	
	  }, {
	    key: "exists",
	    value: function exists(key) {
	      if (this.cache[key]) {
	        return true;
	      } else {
	        return false;
	      }
	    }
	  }]);
	
	  return Cache;
	}();
	
	exports.default = Cache;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.customEvent = customEvent;
	exports.PolyfillHistoryPushState = PolyfillHistoryPushState;
	/**
	 * Adds customEvent method to the window if it doesn't already exist.
	 */
	function customEvent() {
	  if (typeof window.CustomEvent === 'function') {
	    return false;
	  }
	
	  function CustomEvent(event, params) {
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
	function PolyfillHistoryPushState() {
	  var _historyPushState = window.history.pushState;
	  var historyPushStateEvent = new CustomEvent('__f8-history-push-state');
	
	  /**
	   * Restores the original "window.history.pushState" method
	   */
	  function restore() {
	    window.history.pushState = _historyPushState;
	  }
	
	  /**
	   * Applies the event dispatcher to the "history.pushState" method
	   */
	  function fill() {
	    history.pushState = addEventDispatch;
	  }
	
	  /**
	   * A polyfilled version of the history.pushState" method with the
	   * "__f8-history-push-state" dispatched on call.
	   */
	  function addEventDispatch() {
	    var historyPushState = _historyPushState.apply(this, arguments);
	    window.dispatchEvent(historyPushStateEvent);
	    return historyPushState;
	  }
	
	  return {
	    restore: restore,
	    fill: fill
	  };
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map