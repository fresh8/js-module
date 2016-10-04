import 'whatwg-fetch';
import { customEvent } from './polyfill';
import {
  getWindow,
  getRef,
  buildQueryString,
  checkStatusCode,
  parseJSON,
  bindf8ToWindow,
  injectScriptFactory,
  vaildateConfig,
  vaildateRequestAdConf
} from './util';

const version = '1.0.0';

export default class Fresh8 {
  /**
   * Fresh8 is a class that handles the injection of Fresh8 ads into a target
   * based on slot ID.
   * @param {Object} config is the global instance configurations E.G.
   *                        { instID: '54ad56a213fe19232b646047'
   *                        , shouldBreakOut: false  - optinal
   *                        , inApp: false - optional
   *                        , endpoint: '' - optional
   *                        }
   *                        For more details on these options please refer to
   *                        the readme.
   */
  constructor (config) {
    // Pollyfills
    customEvent();
    // The vaildated user config.
    this.config = vaildateConfig(config);
    // The window that should be used to append the ad to.
    this.window = getWindow(this.config.shouldBreakOut);
    // The cache for data lookups use when loading an ad.
    this.adDataCache = [];
    // Cached creative factories, this allows us to not re-load the script
    // for the ads each time.
    this.creativeFactoryCache = {};
    // Bind the "__f8" object to the current window. This is rquired by our ad
    // factories.
    bindf8ToWindow(version, this.window);
    // Bind the global event listener that's fired when the ad factory is loaded.
    this._addEventLisnter();
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
   *                         , competitors: ['Manchester United', 'Sauthampton'] - optinal
   *                         , competitionIDs: ['1245'] - optional Opta ID's
   *                         , competitions: ['Premier League'] - optional
   *                         }
   *                         For more details on these options please refer to
   *                         the readme.
   * @return {Promise}       This is resolved or rejected based on if the ad
   *                         loaded successfully or not.
   */
  requestAd (config = {}) {
    return new Promise((resolve, reject) => {
      const {
        slotID,
        appendPoint,
        url,
        view,
        clickTrackingRedirect,
        sport,
        match,
        competitorIDs,
        competitors,
        competitionIDs,
        competitions
      } = vaildateRequestAdConf(config);

      // Build the end point URL with the slot ID
      const endpoint = this._constructRequestURL({
        slot: slotID,
        view,
        clickUrl: clickTrackingRedirect,
        sport,
        match,
        competitorIds: competitorIDs,
        competitors,
        competitionIds: competitionIDs,
        competitions,
        ref: getRef(this.window, this.config.inApp, url)
      });

      return fetch(endpoint)
        .then(checkStatusCode)
        .then(parseJSON)
        .then(payload => {
          const adData = {
            payload,
            appendPoint: appendPoint,
            resolve,
            reject
          };

          // Cache the ad data for the factory.
          this.adDataCache.push(adData);

          // Inject the scripts for each Ad.
          Object.keys(payload).forEach(creativeRef => {
            // Pass the data directly to the ad if we already have it's factory
            // cached.
            if (this.creativeFactoryCache[creativeRef]) {
              this._loadAd(this.creativeFactoryCache[creativeRef], creativeRef);
            // Else just script for the ad factory and pass the data too it once
            // the loaded event has been emited.
            } else {
              injectScriptFactory(payload[creativeRef].creativePath);
            }
          });
        });
    });
  }

  /**
   * Cleans up any event lisnters added by the class
   */
  remove () {
    this._removeEventLisnter();
  }

  /**
   * Takes a creative ref and matches it with one in the "adDataCache" data,
   * returning an object containing both the index the data was found at and the
   * data itself.
   * @param  {String} ref is the reference to look the data up by
   * @return {Object} is the found data + the index or empty object if not found
   */
  _lookUpAdData (ref) {
    let matchedData = { };

    this.adDataCache.forEach((ad, index) => {
      const creativesRefs = Object.keys(ad.payload);
      if (creativesRefs.indexOf(ref) >= 0) {
        matchedData = { ad, index };
        return;
      }
    });

    return matchedData;
  }

  /**
   * Takes a creative ref and factory, looks up the data from the "adDataCache"
   * matching on the ref passed in, then calls the factory with the data.
   * @param  {Function} creativeFactory is the function used to load the creative
   * @param  {String}   creativeRef     is the creative reference used to look
   *                                    the required data.
   */
  _loadAd (creativeFactory, creativeRef) {
    const { ad, index } = this._lookUpAdData(creativeRef);

    if (ad && ad.payload[creativeRef]) {
      this.adDataCache.splice(index, 1);
      const CSSPath = ad.payload[creativeRef].CSSPath;
      const instance = ad.payload[creativeRef].instances[0];

      instance.data.appendPoint = ad.appendPoint;
      creativeFactory(instance.env, instance.data, CSSPath);
      ad.resolve();
    }
  }

  /**
   * Adds a "__f8-creative-script-loaded" event lisnter to the window
   */
  _addEventLisnter () {
    this.boundEventListner = this._eventListener.bind(this);
    window.addEventListener('__f8-creative-script-loaded', this.boundEventListner);
  }

  /**
   * Handler for the script loaded event that that passes the factory and ref
   * to the "loadAd" function.
   */
  _eventListener (event) {
    // Cache the creative factory so we can re used it later
    this.creativeFactoryCache[event.creativeRef] = event.creativeFactory;
    this._loadAd(event.creativeFactory, event.creativeRef);
  }

  /**
   * Removes the "__f8-creative-script-loaded" event lisnter from the window
   */
  _removeEventLisnter () {
    window.removeEventListener('__f8-creative-script-loaded', this.boundEventListner);
  }

  /**
   * Builds the request URL from the config with the option to add extra
   * key/value.
   * @param  {Object} options is used for adding extra key values to the URL
   *                          as a query strings.
   * @return {String}         The constructed URL
   */
  _constructRequestURL (options = {}) {
    const queryStringsOptions = Object.assign({}, options);

    queryStringsOptions.inApp = this.config.inApp;
    queryStringsOptions.shouldBreakOut = this.config.shouldBreakOut;

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

    return this.config.endpoint + queryString;
  }
}
