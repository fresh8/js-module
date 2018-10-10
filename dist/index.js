'use strict';

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
  console.log(workingWindow);
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
  if (
    userOverrideRef &&
    typeof userOverrideRef !== "undefined" &&
    userOverrideRef !== ""
  ) {
    return encodeURIComponent(userOverrideRef);
  }

  var links = window.document.getElementsByTagName("link");
  var location = window.location.href;

  var canonical = null;
  var ref = "";

  for (var i = 0; i < links.length; i++) {
    if (links[i].rel === "canonical") {
      canonical = links[i].href;
      break;
    }
  }

  if (inApp) {
    ref = "about:blank";
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
  targetWindow.__f8[version].setUndefinedProperty = function(key, val) {
    if (targetWindow.__f8[version][key]) {
      return targetWindow.__f8[version][key];
    } else if (val) {
      if (typeof val === "function") {
        targetWindow.__f8[version][key] = val();
        return targetWindow.__f8[version][key];
      } else {
        targetWindow.__f8[version][key] = val;
        return val;
      }
    } else {
      throw new Error(
        "Trying to access f8 v" +
          version +
          " property " +
          key +
          ", but its not defined"
      );
    }
  };
}

/**
 * Injects a script tag onto the page
 * @param  {String} creativeSource is the URL for the script you want to append
 *                                 to the page.
 */
function injectScriptFactory(creativeSource) {
  console.log("here here here");
  console.log(creativeSource);
  var creativeTag = document.createElement("script");
  creativeTag.type = "text/javascript";
  creativeTag.src = creativeSource;
  creativeTag.async = "async";
  console.log(creativeTag);
  document.body.appendChild(creativeTag);
}

/**
 * Takes a config object and vaildates it
 * @param  {Object} config is the user defined config object
 * @return {Object}        the vaildated object
 */
function vaildateConfig(config) {
  if ( config === void 0 ) config = {};

  if (typeof config.instID === "undefined" || config.instID === "") {
    throw invaildeConfig('Missing "instID" in config');
  }

  if (typeof config.endpoint === "undefined" || config.endpoint === "") {
    config.endpoint = "https://fresh8.co/" + (config.instID) + "/raw";
  }

  if (typeof config.inApp === "undefined") {
    config.inApp = false;
  }

  if (typeof config.shouldBreakOut === "undefined") {
    config.shouldBreakOut = false;
  }

  if (typeof config.listenOnPushState === "undefined") {
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
function requestAdData(config) {
  var vaildatedConfig = vaildateRequestAdConf(config);
  // Build the end point URL with the slot ID
  console.log(vaildatedConfig);
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
  console.log(endpoint);
  console.log("here 4444");
  return fetch(endpoint, { credentials: "include" })
    .then(checkStatusCode)
    .then(parseJSON);
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

  return Promise.reject("Server returned error: " + response.status);
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
function constructRequestURL(url, options) {
  if ( options === void 0 ) options = {};

  var queryStringsOptions = Object.assign({}, options);

  if (typeof queryStringsOptions.competitorIds !== "undefined") {
    queryStringsOptions.competitorIds = queryStringsOptions.competitorIds.map(
      function (value) { return encodeURIComponent(value); }
    );
  }

  if (typeof queryStringsOptions.competitors !== "undefined") {
    queryStringsOptions.competitors = queryStringsOptions.competitors.map(
      function (value) { return encodeURIComponent(value); }
    );
  }

  if (typeof queryStringsOptions.competitionIds !== "undefined") {
    queryStringsOptions.competitionIds = queryStringsOptions.competitionIds.map(
      function (value) { return encodeURIComponent(value); }
    );
  }

  if (typeof queryStringsOptions.competitions !== "undefined") {
    queryStringsOptions.competitions = queryStringsOptions.competitions.map(
      function (value) { return encodeURIComponent(value); }
    );
  }

  var queryString = buildQueryString(queryStringsOptions);
  console.log("gugugu:", url + queryString);
  return url + queryString;
}

/**
 * Takes a requestAd conf object and vaildates it
 * @param  {Object} config is the user defined config object
 * @return {Object}        the vaildated object
 */
function vaildateRequestAdConf(config) {
  if ( config === void 0 ) config = {};

  if (typeof config.endpoint === "undefined" || config.endpoint === "") {
    throw invaildeConfig('Missing "endpoint"');
  }

  if (typeof config.slotID === "undefined" || config.slotID === "") {
    throw invaildeConfig('Missing "slotID"');
  }

  if (typeof config.window === "undefined" || config.window === "") {
    throw invaildeConfig('Missing "window"');
  }

  if (typeof config.inApp === "undefined") {
    config.inApp = false;
  }

  if (typeof config.shouldBreakOut === "undefined") {
    config.shouldBreakOut = false;
  }

  if (typeof config.linkSameWindow === "undefined") {
    config.linkSameWindow = false;
  }

  if (typeof config.competitorIDs === "undefined") {
    config.competitorIDs = [];
  }

  if (typeof config.competitors === "undefined") {
    config.competitors = [];
  }

  if (typeof config.competitionIDs === "undefined") {
    config.competitionIDs = [];
  }

  if (typeof config.competitions === "undefined") {
    config.competitions = [];
  }

  if (typeof config.listenOnPushState === "undefined") {
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
function buildQueryString(options) {
  console.log("options", options);
  var queryString = "?";
  Object.keys(options).forEach(function(option) {
    var value = options[option];
    if (value && value !== "" && value.length !== 0) {
      if (Object.prototype.toString.call(value) === "[object Array]") {
        queryString += option + "=" + value.join(",") + "&";
      } else {
        queryString += option + "=" + value + "&";
      }
    }
  });

  return queryString;
}

var Ad = function Ad(config) {
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

  return new Promise(function (resolve, reject) {
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
    console.log(requestConfig);
    // Make the API request to the ad server
    requestAdData(requestConfig)
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

        if (!payload.env) {
          Object.keys(payload).forEach(function (creativeRef) {
            this$1.creativeRef = creativeRef;
            this$1.CSSPath = payload[creativeRef].CSSPath;
            this$1.data = payload[creativeRef].instances[0].data;
            this$1.env = payload[creativeRef].instances[0].env;
            this$1.creativePath = payload[creativeRef].creativePath;
            this$1.data.appendPoint = this$1.config.appendPoint;
          });
        } else if (payload.env) {
          this$1.evo = true;
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
        }

        // If the ad is adhesion then it wont use the normal append point
        // container selector.
        if (this$1.env.adhesion) {
          this$1.selector = "#f8-adhesion";
        } else {
          this$1.selector = (this$1.config.appendPoint) + " .f8" + (this$1.creativeRef);
        }
        // Pass the data directly to the ad if we already have it's factory
        // cached.
        if (!this$1.awaitingFactory) {
          this$1._callCreativeFactory();
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

  return new Promise(function (resolve, reject) {
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
    requestAdData(requestConfig)
      .then(function (payload) {
        // Grab the creative ref from the playload
        var creativeRef = Object.keys(payload)[0];
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
          this$1.creativePath = payload[creativeRef].creativePath;
          this$1._switchAdType();
        }

        // Update the data state.
        this$1.data = payload[this$1.creativeRef].instances[0].data;
        // Update the env data.
        this$1.env = payload[this$1.creativeRef].instances[0].env;
        // Update the CSS file path.
        this$1.CSSPath = payload[this$1.creativeRef].CSSPath;
        // Force the append point in the data to match the one that the class
        // is using.
        this$1.data.appendPoint = this$1.config.appendPoint;
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
    appEl.parentNode.removeChild(appEl);
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
  console.log("here ierwoiewhr");
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

  return Promise.resolve();
};

/**
 * Vaildates the config for the ad class.
 * @param  {Object} config is the configurations you want to vaildate.
 * @return {Object}        the vaildated config.
 */
function vaildateConfig$1(config) {
  if ( config === void 0 ) config = {};

  if (typeof config.endpoint === "undefined" || config.endpoint === "") {
    throw invaildeConfig('Missing "endpoint"');
  }

  if (
    typeof config.creativeFactoryCache === "undefined" ||
    config.creativeFactoryCache === ""
  ) {
    throw invaildeConfig('Missing "creativeFactoryCache"');
  }

  if (typeof config.slotID === "undefined" || config.slotID === "") {
    throw invaildeConfig('Missing "slotID"');
  }

  if (typeof config.appendPoint === "undefined" || config.appendPoint === "") {
    throw invaildeConfig('Missing "appendPoint"');
  }

  if (typeof config.window === "undefined" || config.window === "") {
    throw invaildeConfig('Missing "window"');
  }

  if (typeof config.inApp === "undefined") {
    config.inApp = false;
  }

  if (typeof config.shouldBreakOut === "undefined") {
    config.shouldBreakOut = false;
  }

  if (typeof config.linkSameWindow === "undefined") {
    config.linkSameWindow = false;
  }

  if (typeof config.competitorIDs === "undefined") {
    config.competitorIDs = [];
  }

  if (typeof config.competitors === "undefined") {
    config.competitors = [];
  }

  if (typeof config.competitionIDs === "undefined") {
    config.competitionIDs = [];
  }

  if (typeof config.competitions === "undefined") {
    config.competitions = [];
  }

  if (typeof config.listenOnPushState === "undefined") {
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

// import "whatwg-fetch";

var version = "1.0.0";

var Fresh8 = function Fresh8(config) {
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

  return new Promise(function (resolve) {
    // Add Fresh8 class data to request ad config
    config.endpoint = this$1.config.endpoint;
    config.window = this$1.window;
    config.creativeFactoryCache = this$1.creativeFactoryCache;
    // Create a new ad and
    console.log("config in request ad", config);
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
  return Promise.all(activeAds.map(function (ad) { return ad.reload(); }));
};

/**
 * Destroys all currently active ads on the page
 * @return {Promise} resolves on completion
 */
Fresh8.prototype.destroyAllAds = function destroyAllAds () {
  var activeAds = this.ads.filter(function (ad) { return ad.active; });
  return Promise.all(activeAds.map(function (ad) { return ad.destroy(); }));
};

/**
 * Adds the "__f8-creative-script-loaded" and "__f8-history-push-state" event
 * lisnters to the window
 */
Fresh8.prototype._addEventLisnters = function _addEventLisnters () {
  console.log("add event listeners");
  this.boundOnCreativeLoaded = this._onCreativeLoaded.bind(this);
  this.boundOnHistoryPushStateChange = this._onHistoryPushStateChange.bind(
    this
  );
  this.window.addEventListener(
    "__f8-creative-script-loaded",
    this.boundOnCreativeLoaded
  );
  this.window.addEventListener(
    "__f8-product-script-loaded",
    this.boundOnCreativeLoaded
  );
  this.window.addEventListener(
    "__f8-history-push-state",
    this.boundOnHistoryPushStateChange
  );
};

/**
 * Removes the "__f8-creative-script-loaded" and "__f8-history-push-state" event
 * lisnters from the window
 */
Fresh8.prototype._removeEventLisnters = function _removeEventLisnters () {
  this.window.removeEventListener(
    "__f8-creative-script-loaded",
    this.boundOnCreativeLoaded
  );
  this.window.removeEventListener(
    "__f8-product-script-loaded",
    this.boundOnCreativeLoaded
  );
  this.window.removeEventListener(
    "__f8-history-push-state",
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
  console.log("this in creative loaded", this);
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

module.exports = Fresh8;
//# sourceMappingURL=index.js.map
