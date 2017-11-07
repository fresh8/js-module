import { requestAdData } from '../api';
import { injectScriptFactory } from '../util';
import { invaildeConfig } from '../errors';

export default class Ad {
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
   *                       , url: 'http://fresh8gaming.com' - optional
   *                       }
   */
  constructor (config = {}) {
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
  load () {
    return new Promise((resolve, reject) => {
      // Construct the object for the request data
      const requestConfig = {
        slotID: this.config.slotID,
        view: this.config.view,
        clickTrackingRedirect: this.config.clickTrackingRedirect,
        sport: this.config.sport,
        match: this.config.match,
        competitorIDs: this.config.competitorIDs,
        competitors: this.config.competitors,
        competitionIDs: this.config.competitionIDs,
        competitions: this.config.competitions,
        window: this.config.window,
        inApp: this.config.inApp,
        endpoint: this.config.endpoint,
        appendPoint: this.config.appendPoint,
        url: this.config.url
      };

      // Make the API request to the ad server
      requestAdData(requestConfig)
        .then(payload => {
          const resolvers = {
            resolve,
            reject
          };

          // Save the promise so it can be revoled after the creative script
          // has loaded.
          this.loadResolvers = resolvers;

          // Inject the scripts for each ad.
          Object.keys(payload).forEach(creativeRef => {
            this.creativeRef = creativeRef;
            this.CSSPath = payload[creativeRef].CSSPath;
            this.data = payload[creativeRef].instances[0].data;
            this.env = payload[creativeRef].instances[0].env;
            this.creativePath = payload[creativeRef].creativePath;
            this.data.appendPoint = this.config.appendPoint;

            // If the ad is adhesion then it wont use the normal append point
            // container selector.
            if (this.env.adhesion) {
              this.selector = '#f8-adhesion';
            } else {
              this.selector = `${this.config.appendPoint} .f8${this.creativeRef}`;
            }

            // Pass the data directly to the ad if we already have it's factory
            // cached.
            if (!this.awaitingFactory) {
              this._callCreativeFactory();
            // Else just script for the ad factory and pass the data too it once
            // the loaded event has been emited.
            } else {
              // Inject the ad factory script and wait for the load event
              injectScriptFactory(this.creativePath);
            }
          });
        })
        .catch(reason => {
          this.active = false;
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
  reload () {
    return new Promise((resolve, reject) => {
      const requestConfig = {
        slotID: this.config.slotID,
        view: this.config.view,
        clickTrackingRedirect: this.config.clickTrackingRedirect,
        sport: this.config.sport,
        match: this.config.match,
        competitorIDs: this.config.competitorIDs,
        competitors: this.config.competitors,
        competitionIDs: this.config.competitionIDs,
        competitions: this.config.competitions,
        window: this.config.window,
        inApp: this.config.inApp,
        endpoint: this.config.endpoint,
        appendPoint: this.config.appendPoint,
        url: this.config.url
      };

      // Request the ad data
      requestAdData(requestConfig)
        .then(payload => {
          // Grab the creative ref from the playload
          const creativeRef = Object.keys(payload)[0];
          const resolvers = {
            resolve,
            reject
          };

          // Save the promises incase they need to be resolved by the inject
          // script.
          this.loadResolvers = resolvers;
          // Distroy the current ad in place.
          this.destroy();
          // If the creative type has changed then switch the ad type and update
          // the currently set creative ref/creative path in the class.
          if (creativeRef !== this.creativeRef) {
            this.creativeRef = creativeRef;
            this.creativePath = payload[creativeRef].creativePath;
            this._switchAdType();
          }

          // Update the data state.
          this.data = payload[this.creativeRef].instances[0].data;
          // Update the env data.
          this.env = payload[this.creativeRef].instances[0].env;
          // Update the CSS file path.
          this.CSSPath = payload[this.creativeRef].CSSPath;
          // Force the append point in the data to match the one that the class
          // is using.
          this.data.appendPoint = this.config.appendPoint;
          // Update the class selector based on the brand being used
          this.selector = `${this.config.appendPoint} .f8${this.creativeRef}`;
          // Finally call the creative factory to create the ad
          return this._callCreativeFactory();
        })
        .catch(reject);
    });
  }

  /**
   * Removes the ad from the DOM and cleans up any brand scripts added.
   * @return {Promise} Resolves when finished.
   */
  destroy () {
    // Only distroy the ad if it's currently active
    if (this.active) {
      const appEl = document.querySelector(this.selector);
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
  _switchAdType () {
    if (this.creativeFactoryCache.exists(this.creativeRef)) {
      this._setCreativeFactory(this.creativeFactoryCache.get(this.creativeRef));
    } else {
      this.awaitingFactory = true;
      injectScriptFactory(this.creativePath);
    }
  }

  /**
   * Takes a creative factory and sets it as the current one in the class and
   * also sets the state to not be waiting for a creative factory.
   * @param {Function} creativeFactory is the creative factory you want to set.
   */
  _setCreativeFactory (creativeFactory) {
    this.awaitingFactory = false;
    this.creativeFactory = creativeFactory;
  }

  /**
   * Calls the currently set creative factory if it's not waiting for one.
   * @return {Promise} Resolves after the creative has been loaded on to the
   * page.
   */
  _callCreativeFactory () {
    if (!this.awaitingFactory) {
      return this.creativeFactory(this.env, this.data, this.CSSPath, this.window)
        .then(adInstance => {
          this.adInstance = adInstance;
          this.active = true;
          this.loadResolvers.resolve(this);
        })
        .catch(this.loadResolvers.reject);
    }

    return Promise.resolve();
  }
}

/**
 * Vaildates the config for the ad class.
 * @param  {Object} config is the configurations you want to vaildate.
 * @return {Object}        the vaildated config.
 */
export function vaildateConfig (config = {}) {
  if (typeof config.endpoint === 'undefined' || config.endpoint === '') {
    throw invaildeConfig('Missing "endpoint"');
  }

  if (typeof config.creativeFactoryCache === 'undefined' || config.creativeFactoryCache === '') {
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
