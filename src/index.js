import 'whatwg-fetch';
import Ad from './ad/index';
import Cache from './cache/index';

import { customEvent, PolyfillHistoryPushState, objectAssign } from './polyfill';
objectAssign();

import { getWindow, bindf8ToWindow, vaildateConfig } from './util';

const version = '1.0.0';

export default class Fresh8 {
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
  constructor (config) {
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
  requestAd (config = {}) {
    return new Promise(resolve => {
      // Add Fresh8 class data to request ad config
      config.endpoint = this.config.endpoint;
      config.window = this.window;
      config.creativeFactoryCache = this.creativeFactoryCache;
      // Create a new ad and
      const ad = new this.Ad(config);

      // Store the ad for reference
      this.ads.push(ad);
      // Load the ad a return the promise
      return resolve(ad.load());
    });
  }

  /**
   * Cleans up any event lisnters/ads added by the class
   */
  remove () {
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
  reloadAllAds () {
    const activeAds = this.ads.filter(ad => ad.active);
    return Promise.all(activeAds.map(ad => ad.reload()));
  }

  /**
   * Destroys all currently active ads on the page
   * @return {Promise} resolves on completion
   */
  destroyAllAds () {
    const activeAds = this.ads.filter(ad => ad.active);
    return Promise.all(activeAds.map(ad => ad.destroy()));
  }

  /**
   * Adds the "__f8-creative-script-loaded" and "__f8-history-push-state" event
   * lisnters to the window
   */
  _addEventLisnters () {
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
  }

  /**
   * Removes the "__f8-creative-script-loaded" and "__f8-history-push-state" event
   * lisnters from the window
   */
  _removeEventLisnters () {
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
  }

  /**
   * Handler for the script loaded event and set the creative factory on any
   * ads that match the creative ref and are waiting for a creativeFactory.
   * @param {Object} event is a custom event object
   */
  _onCreativeLoaded (event) {
    // Cache the creative factory so we can re used it for other ads
    this.creativeFactoryCache.put(event.creativeRef, event.creativeFactory);
    // Loop over the ads and check if any that require a creative factory
    // with the matching creative ref
    this.ads.forEach(ad => {
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
  }

  /**
   * Handels the push state change event that reloads all the currently active
   * ads on the page
   */
  _onHistoryPushStateChange () {
    this.reloadAllAds().catch();
  }
}
