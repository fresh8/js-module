import { invaildeConfig } from './errors';

/**
 * Returns the window object that this script should inject into
 * @param  {Boolean} shouldBreak is whether or not the script should attempt
 *                               to break from iframe.
 * @return {Window} the working window
 */
export function getWindow (shouldBreak) {
  let workingWindow = window;
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
export function getRef (window, inApp, userOverrideRef) {
  if (
    userOverrideRef &&
    typeof userOverrideRef !== 'undefined' &&
    userOverrideRef !== ''
  ) {
    return encodeURIComponent(userOverrideRef);
  }

  const links = window.document.getElementsByTagName('link');
  const location = window.location.href;

  let canonical = null;
  let ref = '';

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
export function bindf8ToWindow (version, targetWindow) {
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
export function injectScriptFactory (creativeSource) {
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
export function vaildateConfig (config = {}) {
  if (typeof config.instID === 'undefined' || config.instID === '') {
    throw invaildeConfig('Missing "instID" in config');
  }

  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
    config.endpoint = `https://fresh8.co/${config.instID}/raw`;
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
