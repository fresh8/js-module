!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e():"function"==typeof define&&define.amd?define(e):e()}(0,function(){"use strict";var o="URLSearchParams"in self,i="Symbol"in self&&"iterator"in Symbol,a="FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(t){return!1}}(),n="FormData"in self,r="ArrayBuffer"in self;if(r)var e=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],s=ArrayBuffer.isView||function(t){return t&&-1<e.indexOf(Object.prototype.toString.call(t))};function c(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function d(t){return"string"!=typeof t&&(t=String(t)),t}function t(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return i&&(t[Symbol.iterator]=function(){return t}),t}function h(e){this.map={},e instanceof h?e.forEach(function(t,e){this.append(e,t)},this):Array.isArray(e)?e.forEach(function(t){this.append(t[0],t[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function p(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function u(o){return new Promise(function(t,e){o.onload=function(){t(o.result)},o.onerror=function(){e(o.error)}})}function f(t){var e=new FileReader,o=u(e);return e.readAsArrayBuffer(t),o}function l(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function v(){return this.bodyUsed=!1,this._initBody=function(t){var e;(this._bodyInit=t)?"string"==typeof t?this._bodyText=t:a&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:n&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:o&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():r&&a&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=l(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):r&&(ArrayBuffer.prototype.isPrototypeOf(t)||s(t))?this._bodyArrayBuffer=l(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):o&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},a&&(this.blob=function(){var t=p(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?p(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(f)}),this.text=function(){var t,e,o,i=p(this);if(i)return i;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,o=u(e),e.readAsText(t),o;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),o=new Array(e.length),i=0;i<e.length;i++)o[i]=String.fromCharCode(e[i]);return o.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},n&&(this.formData=function(){return this.text().then(w)}),this.json=function(){return this.text().then(JSON.parse)},this}h.prototype.append=function(t,e){t=c(t),e=d(e);var o=this.map[t];this.map[t]=o?o+", "+e:e},h.prototype.delete=function(t){delete this.map[c(t)]},h.prototype.get=function(t){return t=c(t),this.has(t)?this.map[t]:null},h.prototype.has=function(t){return this.map.hasOwnProperty(c(t))},h.prototype.set=function(t,e){this.map[c(t)]=d(e)},h.prototype.forEach=function(t,e){for(var o in this.map)this.map.hasOwnProperty(o)&&t.call(e,this.map[o],o,this)},h.prototype.keys=function(){var o=[];return this.forEach(function(t,e){o.push(e)}),t(o)},h.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),t(e)},h.prototype.entries=function(){var o=[];return this.forEach(function(t,e){o.push([e,t])}),t(o)},i&&(h.prototype[Symbol.iterator]=h.prototype.entries);var y=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function m(t,e){var o,i,n=(e=e||{}).body;if(t instanceof m){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new h(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new h(e.headers)),this.method=(o=e.method||this.method||"GET",i=o.toUpperCase(),-1<y.indexOf(i)?i:o),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function w(t){var n=new FormData;return t.trim().split("&").forEach(function(t){if(t){var e=t.split("="),o=e.shift().replace(/\+/g," "),i=e.join("=").replace(/\+/g," ");n.append(decodeURIComponent(o),decodeURIComponent(i))}}),n}function b(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=200<=this.status&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new h(e.headers),this.url=e.url||"",this._initBody(t)}m.prototype.clone=function(){return new m(this,{body:this._bodyInit})},v.call(m.prototype),v.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new h(this.headers),url:this.url})},b.error=function(){var t=new b(null,{status:0,statusText:""});return t.type="error",t};var g=[301,302,303,307,308];b.redirect=function(t,e){if(-1===g.indexOf(e))throw new RangeError("Invalid status code");return new b(null,{status:e,headers:{location:t}})};var _=self.DOMException;try{new _}catch(t){(_=function(t,e){this.message=t,this.name=e;var o=Error(t);this.stack=o.stack}).prototype=Object.create(Error.prototype),_.prototype.constructor=_}function P(n,s){return new Promise(function(i,t){var e=new m(n,s);if(e.signal&&e.signal.aborted)return t(new _("Aborted","AbortError"));var r=new XMLHttpRequest;function o(){r.abort()}r.onload=function(){var t,n,e={status:r.status,statusText:r.statusText,headers:(t=r.getAllResponseHeaders()||"",n=new h,t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var e=t.split(":"),o=e.shift().trim();if(o){var i=e.join(":").trim();n.append(o,i)}}),n)};e.url="responseURL"in r?r.responseURL:e.headers.get("X-Request-URL");var o="response"in r?r.response:r.responseText;i(new b(o,e))},r.onerror=function(){t(new TypeError("Network request failed"))},r.ontimeout=function(){t(new TypeError("Network request failed"))},r.onabort=function(){t(new _("Aborted","AbortError"))},r.open(e.method,e.url,!0),"include"===e.credentials?r.withCredentials=!0:"omit"===e.credentials&&(r.withCredentials=!1),"responseType"in r&&a&&(r.responseType="blob"),e.headers.forEach(function(t,e){r.setRequestHeader(e,t)}),e.signal&&(e.signal.addEventListener("abort",o),r.onreadystatechange=function(){4===r.readyState&&e.signal.removeEventListener("abort",o)}),r.send(void 0===e._bodyInit?null:e._bodyInit)})}function S(t){var e=new Error(t);return e.name="invaildeConfig",e}function I(t){var e=document.createElement("script");e.type="text/javascript",e.src=t,e.async="async",document.body.appendChild(e)}function A(t){var e=function(t){void 0===t&&(t={});if(void 0===t.endpoint||""===t.endpoint)throw S('Missing "endpoint"');if(void 0===t.slotID||""===t.slotID)throw S('Missing "slotID"');if(void 0===t.window||""===t.window)throw S('Missing "window"');void 0===t.inApp&&(t.inApp=!1);void 0===t.shouldBreakOut&&(t.shouldBreakOut=!1);void 0===t.linkSameWindow&&(t.linkSameWindow=!1);void 0===t.competitorIDs&&(t.competitorIDs=[]);void 0===t.competitors&&(t.competitors=[]);void 0===t.competitionIDs&&(t.competitionIDs=[]);void 0===t.competitions&&(t.competitions=[]);void 0===t.listenOnPushState&&(t.listenOnPushState=!1);if(0===t.competitors.length&&0===t.competitions.length||t.sport)return t;throw S('Sport is required if "competitions" or "competitors" is passed through in the config')}(t),o=function(t,e){void 0===e&&(e={});var o=Object.assign({},e);void 0!==o.competitorIds&&(o.competitorIds=o.competitorIds.map(function(t){return encodeURIComponent(t)}));void 0!==o.competitors&&(o.competitors=o.competitors.map(function(t){return encodeURIComponent(t)}));void 0!==o.competitionIds&&(o.competitionIds=o.competitionIds.map(function(t){return encodeURIComponent(t)}));void 0!==o.competitions&&(o.competitions=o.competitions.map(function(t){return encodeURIComponent(t)}));var i=(n=o,r="?",Object.keys(n).forEach(function(t){var e=n[t];e&&""!==e&&0!==e.length&&("[object Array]"===Object.prototype.toString.call(e)?r+=t+"="+e.join(",")+"&":r+=t+"="+e+"&")}),r);var n,r;return t+i}(e.endpoint,{slot:e.slotID,view:e.view,clickUrl:e.clickTrackingRedirect,sport:e.sport,match:e.match,competitorIds:e.competitorIDs,competitors:e.competitors,competitionIds:e.competitionIDs,competitions:e.competitions,linkSameWindow:e.linkSameWindow,brand:e.brand,ref:function(t,e,o){if(o&&void 0!==o&&""!==o)return encodeURIComponent(o);for(var i=t.document.getElementsByTagName("link"),n=t.location.href,r=null,s=0;s<i.length;s++)if("canonical"===i[s].rel){r=i[s].href;break}return e?"about:blank":encodeURIComponent(r||n)}(e.window,e.inApp,e.url)});return fetch(o,{credentials:"include"}).then(E).then(C)}function E(t){return 200<=t.status&&t.status<300?t:Promise.reject("Server returned error: "+t.status)}function C(t){if(t)return t.json()}P.polyfill=!0,self.fetch||(self.fetch=P,self.Headers=h,self.Request=m,self.Response=b);var O=function(t){void 0===t&&(t={}),this.active=!1,this.awaitingFactory=!0,this.selector=null,this.creativeRef=null,this.creativePath=null,this.CSSPath=null,this.data=null,this.env=null,this.loadResolvers=null,this.adInstance=null,this.config=function(t){void 0===t&&(t={});if(void 0===t.endpoint||""===t.endpoint)throw S('Missing "endpoint"');if(void 0===t.creativeFactoryCache||""===t.creativeFactoryCache)throw S('Missing "creativeFactoryCache"');if(void 0===t.slotID||""===t.slotID)throw S('Missing "slotID"');if(void 0===t.appendPoint||""===t.appendPoint)throw S('Missing "appendPoint"');if(void 0===t.window||""===t.window)throw S('Missing "window"');void 0===t.inApp&&(t.inApp=!1);void 0===t.shouldBreakOut&&(t.shouldBreakOut=!1);void 0===t.linkSameWindow&&(t.linkSameWindow=!1);void 0===t.competitorIDs&&(t.competitorIDs=[]);void 0===t.competitors&&(t.competitors=[]);void 0===t.competitionIDs&&(t.competitionIDs=[]);void 0===t.competitions&&(t.competitions=[]);void 0===t.listenOnPushState&&(t.listenOnPushState=!1);if(0===t.competitors.length&&0===t.competitions.length||t.sport)return t;throw S('Sport is required if "competitions" or "competitors" is passed through in the config')}(t),this.creativeFactoryCache=t.creativeFactoryCache,this.window=t.window,this.evo=!1};O.prototype.load=function(){var n=this;return new Promise(function(o,i){A({slotID:n.config.slotID,view:n.config.view,clickTrackingRedirect:n.config.clickTrackingRedirect,sport:n.config.sport,match:n.config.match,competitorIDs:n.config.competitorIDs,competitors:n.config.competitors,competitionIDs:n.config.competitionIDs,competitions:n.config.competitions,window:n.config.window,inApp:n.config.inApp,endpoint:n.config.endpoint,appendPoint:n.config.appendPoint,linkSameWindow:n.config.linkSameWindow,url:n.config.url,brand:n.config.brand}).then(function(e){var t={resolve:o,reject:i};n.loadResolvers=t,e.env&&(n.evo=!0),n.evo?Object.keys(e.products).forEach(function(t){n.creativeRef=e.products[t].config,n.CSSPath=e.products[t].skin,n.data=e.products[t].instances[0],n.env=e.env,n.creativePath=e.env.cdn+"/"+e.products[t].config+".js?v="+e.env.version,n.data.appendPoint=n.config.appendPoint}):Object.keys(e).forEach(function(t){n.creativeRef=t,n.CSSPath=e[t].CSSPath,n.data=e[t].instances[0].data,n.env=e[t].instances[0].env,n.creativePath=e[t].creativePath,n.data.appendPoint=n.config.appendPoint}),n.env.adhesion?n.selector="#f8-adhesion":n.selector=n.config.appendPoint+" .f8"+n.creativeRef,n.awaitingFactory?I(n.creativePath):n._callCreativeFactory()}).catch(function(t){n.active=!1,i(t)})})},O.prototype.reload=function(){var r=this;return new Promise(function(i,n){return A({slotID:r.config.slotID,view:r.config.view,clickTrackingRedirect:r.config.clickTrackingRedirect,sport:r.config.sport,match:r.config.match,competitorIDs:r.config.competitorIDs,competitors:r.config.competitors,competitionIDs:r.config.competitionIDs,competitions:r.config.competitions,window:r.config.window,inApp:r.config.inApp,endpoint:r.config.endpoint,appendPoint:r.config.appendPoint,linkSameWindow:r.config.linkSameWindow,url:r.config.url,brand:r.config.brand}).then(function(e){var t;t=r.evo?e.products[0].config:Object.keys(e)[0];var o={resolve:i,reject:n};return r.loadResolvers=o,r.destroy(),t!==r.creativeRef&&(r.creativeRef=t,r.evo?r.creativePath=e.env.cdn+"/"+e.products[0].config+".js?v="+e.env.version:r.creativePath=e[t].creativePath,r._switchAdType()),r.evo?Object.keys(e.products).forEach(function(t){r.CSSPath=e.products[t].skin,r.data=e.products[t].instances[0],r.env=e.env,r.data.appendPoint=r.config.appendPoint}):Object.keys(e).forEach(function(t){r.CSSPath=e[t].CSSPath,r.data=e[t].instances[0].data,r.env=e[t].instances[0].env,r.data.appendPoint=r.config.appendPoint}),r.selector=r.config.appendPoint+" .f8"+r.creativeRef,r._callCreativeFactory()}).catch(n)})},O.prototype.destroy=function(){if(this.active){var t=document.querySelector(this.selector);this.adInstance.destroy(),this.evo||t.parentNode.removeChild(t),this.active=!1}},O.prototype._switchAdType=function(){this.creativeFactoryCache.exists(this.creativeRef)?this._setCreativeFactory(this.creativeFactoryCache.get(this.creativeRef)):(this.awaitingFactory=!0,I(this.creativePath))},O.prototype._setCreativeFactory=function(t){this.awaitingFactory=!1,this.creativeFactory=t},O.prototype._callCreativeFactory=function(){var e=this;return this.awaitingFactory?Promise.resolve():this.creativeFactory(this.env,this.data,this.CSSPath,this.window).then(function(t){e.adInstance=t,e.active=!0,e.loadResolvers.resolve(e)}).catch(this.loadResolvers.reject)};var F=function(){this.cache={}};function D(){var e=window.history.pushState,o=new CustomEvent("__f8-history-push-state");function t(){var t=e.apply(this,arguments);return window.dispatchEvent(o),t}return{restore:function(){window.history.pushState=e},fill:function(){history.pushState=t}}}F.prototype.put=function(t,e){this.cache[t]=e},F.prototype.remove=function(t){this.cache[t]&&delete this.cache[t]},F.prototype.get=function(t){return this.cache[t]},F.prototype.exists=function(t){return!!this.cache[t]};var R=function(t){var o,i;this.Ad=O,function(){if("function"==typeof window.CustomEvent)return;function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var o=document.createEvent("CustomEvent");return o.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),o}t.prototype=window.Event.prototype,window.CustomEvent=t}(),this.config=function(t){if(void 0===t&&(t={}),void 0===t.instID||""===t.instID)throw S('Missing "instID" in config');return void 0!==t.endpoint&&""!==t.endpoint||(t.endpoint="https://ads-staging.fresh8.co/"+t.instID+"/raw"),void 0===t.inApp&&(t.inApp=!1),void 0===t.shouldBreakOut&&(t.shouldBreakOut=!1),void 0===t.listenOnPushState&&(t.listenOnPushState=!1),t}(t),this.window=function(t){var e=window;if(t)try{for(;e!==e.top;)e.parent.location.href,e=e.parent}catch(t){}return e}(this.config.shouldBreakOut),this.ads=[],this.creativeFactoryCache=new F,o="1.0.0",(i=this.window).__f8||(i.__f8={}),i.__f8[o]||(i.__f8[o]={}),i.__f8[o].setUndefinedProperty=function(t,e){if(i.__f8[o][t])return i.__f8[o][t];if(e)return"function"==typeof e?(i.__f8[o][t]=e(),i.__f8[o][t]):i.__f8[o][t]=e;throw new Error("Trying to access f8 v"+o+" property "+t+", but its not defined")},this._addEventLisnters(),this.config.listenOnPushState&&(this.polyfillHistoryPushState=new D,this.polyfillHistoryPushState.fill())};R.prototype.requestAd=function(o){var i=this;return void 0===o&&(o={}),new Promise(function(t){o.endpoint=i.config.endpoint,o.window=i.window,o.creativeFactoryCache=i.creativeFactoryCache;var e=new i.Ad(o);return i.ads.push(e),t(e.load())})},R.prototype.remove=function(){this._removeEventLisnters(),this.destroyAllAds(),this.config.listenOnPushState&&this.polyfillHistoryPushState.restore()},R.prototype.reloadAllAds=function(){var t=this.ads.filter(function(t){return t.active});return Promise.all(t.map(function(t){return t.reload()}))},R.prototype.destroyAllAds=function(){var t=this.ads.filter(function(t){return t.active});return Promise.all(t.map(function(t){return t.destroy()}))},R.prototype._addEventLisnters=function(){this.boundOnCreativeLoaded=this._onCreativeLoaded.bind(this),this.boundOnHistoryPushStateChange=this._onHistoryPushStateChange.bind(this),this.window.addEventListener("__f8-creative-script-loaded",this.boundOnCreativeLoaded),this.window.addEventListener("__f8-product-script-loaded",this.boundOnCreativeLoaded),this.window.addEventListener("__f8-history-push-state",this.boundOnHistoryPushStateChange)},R.prototype._removeEventLisnters=function(){this.window.removeEventListener("__f8-creative-script-loaded",this.boundOnCreativeLoaded),this.window.removeEventListener("__f8-product-script-loaded",this.boundOnCreativeLoaded),this.window.removeEventListener("__f8-history-push-state",this.boundOnHistoryPushStateChange)},R.prototype._onCreativeLoaded=function(e){this.creativeFactoryCache.put(e.creativeRef,e.creativeFactory),this.ads.forEach(function(t){t.evo?t.awaitingFactory&&e.config===t.creativeRef&&(t._setCreativeFactory(e.productFactory),t._callCreativeFactory()):t.awaitingFactory&&e.creativeRef===t.creativeRef&&(t._setCreativeFactory(e.creativeFactory),t._callCreativeFactory())})},R.prototype._onHistoryPushStateChange=function(){this.reloadAllAds().catch()},window.Fresh8||(window.Fresh8=R)});
//# sourceMappingURL=browser.js.map
