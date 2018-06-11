import { getRef } from '../util';
import { invaildeConfig } from '../errors';

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
export function requestAdData (config) {
  const vaildatedConfig = vaildateRequestAdConf(config);

  // Build the end point URL with the slot ID
  const endpoint = constructRequestURL(
    vaildatedConfig.endpoint,
    {
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
      ref: getRef(vaildatedConfig.window, vaildatedConfig.inApp, vaildatedConfig.url)
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
export function checkStatusCode (response) {
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
export function parseJSON (response) {
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
export function constructRequestURL (url, options = {}) {
  const queryStringsOptions = Object.assign({}, options);

  if (typeof queryStringsOptions.competitorIds !== 'undefined') {
    queryStringsOptions.competitorIds = queryStringsOptions.competitorIds.map(value => encodeURIComponent(value));
  }

  if (typeof queryStringsOptions.competitors !== 'undefined') {
    queryStringsOptions.competitors = queryStringsOptions.competitors.map(value => encodeURIComponent(value));
  }

  if (typeof queryStringsOptions.competitionIds !== 'undefined') {
    queryStringsOptions.competitionIds = queryStringsOptions.competitionIds.map(value => encodeURIComponent(value));
  }

  if (typeof queryStringsOptions.competitions !== 'undefined') {
    queryStringsOptions.competitions = queryStringsOptions.competitions.map(value => encodeURIComponent(value));
  }

  const queryString = buildQueryString(queryStringsOptions);

  return url + queryString;
}

/**
 * Takes a requestAd conf object and vaildates it
 * @param  {Object} config is the user defined config object
 * @return {Object}        the vaildated object
 */
export function vaildateRequestAdConf (config = {}) {
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

  if ((config.competitors.length !== 0 || config.competitions.length !== 0) && !config.sport) {
    throw invaildeConfig('Sport is required if "competitions" or "competitors" is passed through in the config');
  }

  return config;
}

/**
 * Takes a dictionary and converts it to a queryString
 * @param  {Object} dictionary is a dictionary of string key's to
 *                             string values.
 * @return {String} a queryString in the form of `?key=val&keyTwo=valTwo`.
 */
export function buildQueryString (options) {
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
