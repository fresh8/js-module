# Fresh8 JS Module
[![CircleCI](https://circleci.com/gh/fresh8/js-module.svg?style=svg)](https://circleci.com/gh/fresh8/js-module)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Dynamically inject [Fresh8](http://fresh8gaming.com) ads into your website or app.

## Prerequisite
This project is auto compiled from ES2015 to ES5 by Babel, if you'd like to use the ES2015 code directly you can require it by doing the following:
```
import Fresh8 from 'fresh8/src';
```

## Getting started
If you want use this in an [React](https://facebook.github.io/react/) app you can use our prebuilt component [here](https://github.com/fresh8/react-component).

### Common JS
- `npm install fresh8-js-module --save`
- `var Fresh8 = require('fresh8-js-module').default;`

### ES2015 Import
- `npm install fresh8-js-module --save`
- `import Fresh8 from 'fresh8-js-module';`

### Browser Script
You can find a minified script that defines the `Fresh8` object globally in `dist/browser.js`.

## Installation ID's and Slot ID's
During your on-boarding process you'll receive a unique set of ID's for the publications, websites and applications you want to display ads on. We refer to these as "installation ID's", each ID is unique to the publication and allows you to control the ads via our console. Along with these you'll also receive a set of slot ID's that determine what sizes of ad creative will be served to your publications, you can see a list of available slots [here](https://console.fresh8.co/ad-slots).

## Configuration
The `Fresh8` class takes a number of different configurations as an `Object`, the following lists each available option and what it does:

#### `instID`
The installation ID for the publication you want to create ads for.

| Key      | Value   | Required | Default     |
|----------|---------|----------|-------------|
| `instID` | String  | Y        | `undefined` |

#### `shouldBreakOut`
This controls if the ads should try and break out of iframe's and append to the most top `window`. It does this by looping over all the `window.parent` properties until there are no more or an error is throw because of a browser security exception. This is useful if you want to inject the ads via a third party ad manger that uses iframe's but still want the ads to be displayed in the correct element outside of the iframe.

| Key              | Value   | Required | Default |
|------------------|---------|----------|---------|
| `shouldBreakOut` | Boolean | N        | `false` |

#### `inApp`
This defines if the ads are being used inside of a web view in Android/iOS.

| Key     | Value   | Required | Default |
|---------|---------|----------|---------|
| `inApp` | Boolean | N        | `false` |

#### `listenOnPushState`
Monkey patches the `window.history.pushState` function to emit an event, on receipt of this event the ads will reload. Useful for single page apps that don't reload the page on navigation.

| Key                 | Value   | Required | Default |
|---------------------|---------|----------|---------|
| `listenOnPushState` | Boolean | N        | `false` |

## Methods

### `remove()`
Removes any event listeners added by the class and destroys any ads on the page.

### `destroyAllAds()`
Removes all ads from the page.

### `reloadAllAds()`
Refreshes all the currently active ads on the page and returns promise that resolves with an array of ads.

### `requestAd(config)`
requestAd method takes a number of different configurations as an `Object` and returns a promise. The following lists each available option and what it does:

#### `slotID`
The slot size that you'd like to request an for.

| Name     | Type   | Required | Default     |
|----------|--------|----------|-------------|
| `slotID` | String | Y        | `undefined` |

#### `appendPoint`
This is a query selector string that defines where the ad will be appended on the page.

| Name          | Type   | Required | Default     |
|---------------|--------|----------|-------------|
| `appendPoint` | String | Y        | `undefined` |

#### `url`
This allows you to override the default URL that the classification engine uses when determining sports, teams and players are in your content. By default this will use the `window.location`, unless [canonical](https://support.google.com/webmasters/answer/139066?hl=en) link tag is found on the page.

| Key    | Value   | Required | Default                                       |
|--------|---------|----------|-----------------------------------------------|
| `url`  | String  | X        | `window.location` or `<link rel="canonical">` |

#### `view`
View is used for targeting and identifying specific views/pages in the [Fresh8 Console](https://console.fresh8.co). For example you might want to just do a specific set of ads on the `football` view pages.

| Key    | Value   | Required | Default |
|--------|---------|----------|---------|
| `view` | String  | X        | `''`    |

#### `clickTrackingRedirect`
An optional redirection URL used for tracking .E.G a Google DFP click macro `%%CLICK_URL_ESC_ESC%%`.

| Name                    | Type   | Required | Default |
|-------------------------|--------|----------|---------|
| `clickTrackingRedirect` | String | X        | `''`    |

#### `sport`
An optional sport value used for targeting overrides, for example `cricket`.
*Note: Sport is required if `competitors` or `competitions` are added as part of the config.*

| Key     | Value   | Required | Default |
|---------|---------|----------|---------|
| `sport` | String  | X/Y      | `''`    |

#### `matchID`
An optional [Opta](http://www.optasports.com/) ID used for targeting overrides.
*Note: Opta ID's are only supported for football currently.*

| Key       | Value   | Required | Default |
|---------- |---------|----------|---------|
| `matchID` | String  | X        | `''`    |

#### `competitorIDs`
Optional [Opta](http://www.optasports.com/) ID's used for targeting overrides.
*Note: Opta ID's are only supported for football currently.*

| Key             | Value  | Required | Default |
|-----------------|--------|----------|---------|
| `competitorIDs` | Array  | X        | `[]`    |

#### `competitors`
An optional competitors array used for targeting overrides, for example `['Manchester United', 'Southampton']`.

| Key           | Value  | Required | Default |
|---------------|--------|----------|---------|
| `competitors` | Array  | X        | `[]`    |

#### `competitionIDs`
Optional [Opta](http://www.optasports.com/) ID's used for targeting overrides.
*Note: Opta ID's are only supported for football currently.*

| Key              | Value | Required | Default |
|------------------|-------|----------|---------|
| `competitionIDs` | Array | X        | `[]`    |

#### `competitions`
An optional competitions array used for targeting overrides, for example `['Premier League'] `.

| Key            | Value | Required | Default |
|----------------|-------|----------|---------|
| `competitions` | Array | X        | `[]`    |

## Ad class
An instantiated ad class is resolved from the `requestAd` method on success

### Methods

#### `reload`
Reloads destroys the current ad in place then requests new data from the ad serving API. Using that data it creates a new ad in it's place.

#### `destroy`
Removes the ad from the DOM and cleans up any event listens and scripts added.

## Examples
This is an example of the simplest configuration possible:
```
var config = { instID: '40410' };
var fresh8 = new Fresh8(config);

fresh8.requestAd({ slotID: 'f8-001', appendPoint: 'body' });
```

A more complex config might look like:
```
var config = { instID: '40410', inApp: false, shouldBreakOut: false, listenOnPushState: false };
var fresh8 = new Fresh8(config);

fresh8
  .requestAd({
    slotID: 'f8-001',
    url: 'http://fresh8gaming.com',
    appendPoint: 'body',
    view: 'home-page',
    clickTrackingRedirect: 'http://dfp.com?r=',
    sport: 'football',
    competitors: ['Manchester United', 'Southampton'],
    competitions: ['Premier League'],
    listenOnPushState: true
  })
  .then(ad => console.log('Ad loaded', ad))
  .catch(reason => console.error(reason));
```

## Contributing and Developing

### Testing
- Running unit tests: `npm test`
- Running coverage tests: `npm run coverage && npm run cov`

### Scripts
- `coverage`: Runs the isparta code coverage on the module
- `test`: Runs the unit tests
- `build`: Compiles the code to ES5 in the dist folder
- `dev`: Compiles the code to ES5 and watches for changes
- `cov` Opens the code coverage folder
