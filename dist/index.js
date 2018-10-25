"use strict";var support={searchParams:"URLSearchParams"in self,iterable:"Symbol"in self&&"iterator"in Symbol,blob:"FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in self,arrayBuffer:"ArrayBuffer"in self};function isDataView(t){return t&&DataView.prototype.isPrototypeOf(t)}if(support.arrayBuffer)var viewClasses=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],isArrayBufferView=ArrayBuffer.isView||function(t){return t&&-1<viewClasses.indexOf(Object.prototype.toString.call(t))};function normalizeName(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function normalizeValue(t){return"string"!=typeof t&&(t=String(t)),t}function iteratorFor(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return support.iterable&&(t[Symbol.iterator]=function(){return t}),t}function Headers(e){this.map={},e instanceof Headers?e.forEach(function(t,e){this.append(e,t)},this):Array.isArray(e)?e.forEach(function(t){this.append(t[0],t[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function consumed(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function fileReaderReady(o){return new Promise(function(t,e){o.onload=function(){t(o.result)},o.onerror=function(){e(o.error)}})}function readBlobAsArrayBuffer(t){var e=new FileReader,o=fileReaderReady(e);return e.readAsArrayBuffer(t),o}function readBlobAsText(t){var e=new FileReader,o=fileReaderReady(e);return e.readAsText(t),o}function readArrayBufferAsText(t){for(var e=new Uint8Array(t),o=new Array(e.length),i=0;i<e.length;i++)o[i]=String.fromCharCode(e[i]);return o.join("")}function bufferClone(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function Body(){return this.bodyUsed=!1,this._initBody=function(t){(this._bodyInit=t)?"string"==typeof t?this._bodyText=t:support.blob&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:support.formData&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:support.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():support.arrayBuffer&&support.blob&&isDataView(t)?(this._bodyArrayBuffer=bufferClone(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):support.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(t)||isArrayBufferView(t))?this._bodyArrayBuffer=bufferClone(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):support.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},support.blob&&(this.blob=function(){var t=consumed(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?consumed(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(readBlobAsArrayBuffer)}),this.text=function(){var t=consumed(this);if(t)return t;if(this._bodyBlob)return readBlobAsText(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},support.formData&&(this.formData=function(){return this.text().then(decode)}),this.json=function(){return this.text().then(JSON.parse)},this}Headers.prototype.append=function(t,e){t=normalizeName(t),e=normalizeValue(e);var o=this.map[t];this.map[t]=o?o+", "+e:e},Headers.prototype.delete=function(t){delete this.map[normalizeName(t)]},Headers.prototype.get=function(t){return t=normalizeName(t),this.has(t)?this.map[t]:null},Headers.prototype.has=function(t){return this.map.hasOwnProperty(normalizeName(t))},Headers.prototype.set=function(t,e){this.map[normalizeName(t)]=normalizeValue(e)},Headers.prototype.forEach=function(t,e){for(var o in this.map)this.map.hasOwnProperty(o)&&t.call(e,this.map[o],o,this)},Headers.prototype.keys=function(){var o=[];return this.forEach(function(t,e){o.push(e)}),iteratorFor(o)},Headers.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),iteratorFor(e)},Headers.prototype.entries=function(){var o=[];return this.forEach(function(t,e){o.push([e,t])}),iteratorFor(o)},support.iterable&&(Headers.prototype[Symbol.iterator]=Headers.prototype.entries);var methods=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function normalizeMethod(t){var e=t.toUpperCase();return-1<methods.indexOf(e)?e:t}function Request(t,e){var o=(e=e||{}).body;if(t instanceof Request){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new Headers(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new Headers(e.headers)),this.method=normalizeMethod(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function decode(t){var r=new FormData;return t.trim().split("&").forEach(function(t){if(t){var e=t.split("="),o=e.shift().replace(/\+/g," "),i=e.join("=").replace(/\+/g," ");r.append(decodeURIComponent(o),decodeURIComponent(i))}}),r}function parseHeaders(t){var r=new Headers;return t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var e=t.split(":"),o=e.shift().trim();if(o){var i=e.join(":").trim();r.append(o,i)}}),r}function Response(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=200<=this.status&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new Headers(e.headers),this.url=e.url||"",this._initBody(t)}Request.prototype.clone=function(){return new Request(this,{body:this._bodyInit})},Body.call(Request.prototype),Body.call(Response.prototype),Response.prototype.clone=function(){return new Response(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new Headers(this.headers),url:this.url})},Response.error=function(){var t=new Response(null,{status:0,statusText:""});return t.type="error",t};var redirectStatuses=[301,302,303,307,308];Response.redirect=function(t,e){if(-1===redirectStatuses.indexOf(e))throw new RangeError("Invalid status code");return new Response(null,{status:e,headers:{location:t}})};var DOMException=self.DOMException;try{new DOMException}catch(t){(DOMException=function(t,e){this.message=t,this.name=e;var o=Error(t);this.stack=o.stack}).prototype=Object.create(Error.prototype),DOMException.prototype.constructor=DOMException}function fetch$1(n,s){return new Promise(function(o,t){var e=new Request(n,s);if(e.signal&&e.signal.aborted)return t(new DOMException("Aborted","AbortError"));var i=new XMLHttpRequest;function r(){i.abort()}i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:parseHeaders(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;o(new Response(e,t))},i.onerror=function(){t(new TypeError("Network request failed"))},i.ontimeout=function(){t(new TypeError("Network request failed"))},i.onabort=function(){t(new DOMException("Aborted","AbortError"))},i.open(e.method,e.url,!0),"include"===e.credentials?i.withCredentials=!0:"omit"===e.credentials&&(i.withCredentials=!1),"responseType"in i&&support.blob&&(i.responseType="blob"),e.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),e.signal&&(e.signal.addEventListener("abort",r),i.onreadystatechange=function(){4===i.readyState&&e.signal.removeEventListener("abort",r)}),i.send(void 0===e._bodyInit?null:e._bodyInit)})}function invaildeConfig(t){var e=new Error(t);return e.name="invaildeConfig",e}function getWindow(t){var e=window;if(t)try{for(;e!==e.top;)e.parent.location.href,e=e.parent}catch(t){}return e}function getRef(t,e,o){if(o&&void 0!==o&&""!==o)return encodeURIComponent(o);for(var i=t.document.getElementsByTagName("link"),r=t.location.href,n=null,s=0;s<i.length;s++)if("canonical"===i[s].rel){n=i[s].href;break}return e?"about:blank":encodeURIComponent(n||r)}function bindf8ToWindow(o,i){i.__f8||(i.__f8={}),i.__f8[o]||(i.__f8[o]={}),i.__f8[o].setUndefinedProperty=function(t,e){if(i.__f8[o][t])return i.__f8[o][t];if(e)return"function"==typeof e?(i.__f8[o][t]=e(),i.__f8[o][t]):i.__f8[o][t]=e;throw new Error("Trying to access f8 v"+o+" property "+t+", but its not defined")}}function injectScriptFactory(t){var e=document.createElement("script");e.type="text/javascript",e.src=t,e.async="async",document.body.appendChild(e)}function vaildateConfig(t){if(void 0===t&&(t={}),void 0===t.instID||""===t.instID)throw invaildeConfig('Missing "instID" in config');return void 0!==t.endpoint&&""!==t.endpoint||(t.endpoint="https://fresh8.co/"+t.instID+"/raw"),void 0===t.inApp&&(t.inApp=!1),void 0===t.shouldBreakOut&&(t.shouldBreakOut=!1),void 0===t.listenOnPushState&&(t.listenOnPushState=!1),t}function requestAdData(t){var e=vaildateRequestAdConf(t),o=constructRequestURL(e.endpoint,{slot:e.slotID,view:e.view,clickUrl:e.clickTrackingRedirect,sport:e.sport,match:e.match,competitorIds:e.competitorIDs,competitors:e.competitors,competitionIds:e.competitionIDs,competitions:e.competitions,linkSameWindow:e.linkSameWindow,brand:e.brand,ref:getRef(e.window,e.inApp,e.url)});return fetch(o,{credentials:"include"}).then(checkStatusCode).then(parseJSON)}function checkStatusCode(t){return 200<=t.status&&t.status<300?t:Promise.reject("Server returned error: "+t.status)}function parseJSON(t){if(t)return t.json()}function constructRequestURL(t,e){void 0===e&&(e={});var o=Object.assign({},e);return void 0!==o.competitorIds&&(o.competitorIds=o.competitorIds.map(function(t){return encodeURIComponent(t)})),void 0!==o.competitors&&(o.competitors=o.competitors.map(function(t){return encodeURIComponent(t)})),void 0!==o.competitionIds&&(o.competitionIds=o.competitionIds.map(function(t){return encodeURIComponent(t)})),void 0!==o.competitions&&(o.competitions=o.competitions.map(function(t){return encodeURIComponent(t)})),t+buildQueryString(o)}function vaildateRequestAdConf(t){if(void 0===t&&(t={}),void 0===t.endpoint||""===t.endpoint)throw invaildeConfig('Missing "endpoint"');if(void 0===t.slotID||""===t.slotID)throw invaildeConfig('Missing "slotID"');if(void 0===t.window||""===t.window)throw invaildeConfig('Missing "window"');if(void 0===t.inApp&&(t.inApp=!1),void 0===t.shouldBreakOut&&(t.shouldBreakOut=!1),void 0===t.linkSameWindow&&(t.linkSameWindow=!1),void 0===t.competitorIDs&&(t.competitorIDs=[]),void 0===t.competitors&&(t.competitors=[]),void 0===t.competitionIDs&&(t.competitionIDs=[]),void 0===t.competitions&&(t.competitions=[]),void 0===t.listenOnPushState&&(t.listenOnPushState=!1),(0!==t.competitors.length||0!==t.competitions.length)&&!t.sport)throw invaildeConfig('Sport is required if "competitions" or "competitors" is passed through in the config');return t}function buildQueryString(o){var i="?";return Object.keys(o).forEach(function(t){var e=o[t];e&&""!==e&&0!==e.length&&("[object Array]"===Object.prototype.toString.call(e)?i+=t+"="+e.join(",")+"&":i+=t+"="+e+"&")}),i}fetch$1.polyfill=!0,self.fetch||(self.fetch=fetch$1,self.Headers=Headers,self.Request=Request,self.Response=Response);var Ad=function(t){void 0===t&&(t={}),this.active=!1,this.awaitingFactory=!0,this.selector=null,this.creativeRef=null,this.creativePath=null,this.CSSPath=null,this.data=null,this.env=null,this.loadResolvers=null,this.adInstance=null,this.config=vaildateConfig$1(t),this.creativeFactoryCache=t.creativeFactoryCache,this.window=t.window,this.evo=!1};function vaildateConfig$1(t){if(void 0===t&&(t={}),void 0===t.endpoint||""===t.endpoint)throw invaildeConfig('Missing "endpoint"');if(void 0===t.creativeFactoryCache||""===t.creativeFactoryCache)throw invaildeConfig('Missing "creativeFactoryCache"');if(void 0===t.slotID||""===t.slotID)throw invaildeConfig('Missing "slotID"');if(void 0===t.appendPoint||""===t.appendPoint)throw invaildeConfig('Missing "appendPoint"');if(void 0===t.window||""===t.window)throw invaildeConfig('Missing "window"');if(void 0===t.inApp&&(t.inApp=!1),void 0===t.shouldBreakOut&&(t.shouldBreakOut=!1),void 0===t.linkSameWindow&&(t.linkSameWindow=!1),void 0===t.competitorIDs&&(t.competitorIDs=[]),void 0===t.competitors&&(t.competitors=[]),void 0===t.competitionIDs&&(t.competitionIDs=[]),void 0===t.competitions&&(t.competitions=[]),void 0===t.listenOnPushState&&(t.listenOnPushState=!1),(0!==t.competitors.length||0!==t.competitions.length)&&!t.sport)throw invaildeConfig('Sport is required if "competitions" or "competitors" is passed through in the config');return t}Ad.prototype.load=function(){var r=this;return new Promise(function(o,i){return requestAdData({slotID:r.config.slotID,view:r.config.view,clickTrackingRedirect:r.config.clickTrackingRedirect,sport:r.config.sport,match:r.config.match,competitorIDs:r.config.competitorIDs,competitors:r.config.competitors,competitionIDs:r.config.competitionIDs,competitions:r.config.competitions,window:r.config.window,inApp:r.config.inApp,endpoint:r.config.endpoint,appendPoint:r.config.appendPoint,linkSameWindow:r.config.linkSameWindow,url:r.config.url,brand:r.config.brand}).then(function(e){var t={resolve:o,reject:i};if(r.loadResolvers=t,e.env&&(r.evo=!0),r.evo?Object.keys(e.products).forEach(function(t){r.creativeRef=e.products[t].config,r.CSSPath=e.products[t].skin,r.data=e.products[t].instances[0],r.env=e.env,r.creativePath=e.env.cdn+"/"+e.products[t].config+".js?v="+e.env.version,r.data.appendPoint=r.config.appendPoint}):Object.keys(e).forEach(function(t){r.creativeRef=t,r.CSSPath=e[t].CSSPath,r.data=e[t].instances[0].data,r.env=e[t].instances[0].env,r.creativePath=e[t].creativePath,r.data.appendPoint=r.config.appendPoint}),r.env.adhesion?r.selector="#f8-adhesion":r.selector=r.config.appendPoint+" .f8"+r.creativeRef,!r.awaitingFactory)return r._callCreativeFactory();injectScriptFactory(r.creativePath)}).catch(function(t){r.active=!1,i(t)})})},Ad.prototype.reload=function(){var n=this;return new Promise(function(i,r){return requestAdData({slotID:n.config.slotID,view:n.config.view,clickTrackingRedirect:n.config.clickTrackingRedirect,sport:n.config.sport,match:n.config.match,competitorIDs:n.config.competitorIDs,competitors:n.config.competitors,competitionIDs:n.config.competitionIDs,competitions:n.config.competitions,window:n.config.window,inApp:n.config.inApp,endpoint:n.config.endpoint,appendPoint:n.config.appendPoint,linkSameWindow:n.config.linkSameWindow,url:n.config.url,brand:n.config.brand}).then(function(e){var t;t=n.evo?e.products[0].config:Object.keys(e)[0];var o={resolve:i,reject:r};return n.loadResolvers=o,n.destroy(),t!==n.creativeRef&&(n.creativeRef=t,n.evo?n.creativePath=e.env.cdn+"/"+e.products[0].config+".js?v="+e.env.version:n.creativePath=e[t].creativePath,n._switchAdType()),n.evo?Object.keys(e.products).forEach(function(t){n.CSSPath=e.products[t].skin,n.data=e.products[t].instances[0],n.env=e.env,n.data.appendPoint=n.config.appendPoint}):Object.keys(e).forEach(function(t){n.CSSPath=e[t].CSSPath,n.data=e[t].instances[0].data,n.env=e[t].instances[0].env,n.data.appendPoint=n.config.appendPoint}),n.selector=n.config.appendPoint+" .f8"+n.creativeRef,n._callCreativeFactory()}).catch(r)})},Ad.prototype.destroy=function(){if(this.active){var t=document.querySelector(this.selector);this.adInstance.destroy(),this.evo||t.parentNode.removeChild(t),this.active=!1}},Ad.prototype._switchAdType=function(){this.creativeFactoryCache.exists(this.creativeRef)?this._setCreativeFactory(this.creativeFactoryCache.get(this.creativeRef)):(this.awaitingFactory=!0,injectScriptFactory(this.creativePath))},Ad.prototype._setCreativeFactory=function(t){this.awaitingFactory=!1,this.creativeFactory=t},Ad.prototype._callCreativeFactory=function(){var e=this;return this.awaitingFactory?Promise.resolve():this.creativeFactory(this.env,this.data,this.CSSPath,this.window).then(function(t){e.adInstance=t,e.active=!0,e.loadResolvers.resolve(e)}).catch(this.loadResolvers.reject)};var Cache=function(){this.cache={}};function customEvent(){if("function"==typeof window.CustomEvent)return!1;function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var o=document.createEvent("CustomEvent");return o.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),o}t.prototype=window.Event.prototype,window.CustomEvent=t}function PolyfillHistoryPushState(){var e=window.history.pushState,o=new CustomEvent("__f8-history-push-state");function t(){var t=e.apply(this,arguments);return window.dispatchEvent(o),t}return{restore:function(){window.history.pushState=e},fill:function(){history.pushState=t}}}function objectAssign(){"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(t,e){var o=arguments;if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),r=1;r<arguments.length;r++){var n=o[r];if(null!=n)for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=n[s])}return i},writable:!0,configurable:!0})}Cache.prototype.put=function(t,e){this.cache[t]=e},Cache.prototype.remove=function(t){this.cache[t]&&delete this.cache[t]},Cache.prototype.get=function(t){return this.cache[t]},Cache.prototype.exists=function(t){return!!this.cache[t]},objectAssign();var version="1.0.0",Fresh8=function(t){this.Ad=Ad,customEvent(),this.config=vaildateConfig(t),this.window=getWindow(this.config.shouldBreakOut),this.ads=[],this.creativeFactoryCache=new Cache,bindf8ToWindow(version,this.window),this._addEventLisnters(),this.config.listenOnPushState&&(this.polyfillHistoryPushState=new PolyfillHistoryPushState,this.polyfillHistoryPushState.fill())};Fresh8.prototype.requestAd=function(o){var i=this;return void 0===o&&(o={}),new Promise(function(t){o.endpoint=i.config.endpoint,o.window=i.window,o.creativeFactoryCache=i.creativeFactoryCache;var e=new i.Ad(o);return i.ads.push(e),t(e.load())})},Fresh8.prototype.remove=function(){this._removeEventLisnters(),this.destroyAllAds(),this.config.listenOnPushState&&this.polyfillHistoryPushState.restore()},Fresh8.prototype.reloadAllAds=function(){var t=this.ads.filter(function(t){return t.active});return Promise.all(t.map(function(t){return t.reload()}))},Fresh8.prototype.destroyAllAds=function(){var t=this.ads.filter(function(t){return t.active});return Promise.all(t.map(function(t){return t.destroy()}))},Fresh8.prototype._addEventLisnters=function(){this.boundOnCreativeLoaded=this._onCreativeLoaded.bind(this),this.boundOnHistoryPushStateChange=this._onHistoryPushStateChange.bind(this),this.window.addEventListener("__f8-creative-script-loaded",this.boundOnCreativeLoaded),this.window.addEventListener("__f8-product-script-loaded",this.boundOnCreativeLoaded),this.window.addEventListener("__f8-history-push-state",this.boundOnHistoryPushStateChange)},Fresh8.prototype._removeEventLisnters=function(){this.window.removeEventListener("__f8-creative-script-loaded",this.boundOnCreativeLoaded),this.window.removeEventListener("__f8-product-script-loaded",this.boundOnCreativeLoaded),this.window.removeEventListener("__f8-history-push-state",this.boundOnHistoryPushStateChange)},Fresh8.prototype._onCreativeLoaded=function(e){this.creativeFactoryCache.put(e.creativeRef,e.creativeFactory),this.ads.forEach(function(t){t.evo?t.awaitingFactory&&e.config===t.creativeRef&&(t._setCreativeFactory(e.productFactory),t._callCreativeFactory()):t.awaitingFactory&&e.creativeRef===t.creativeRef&&(t._setCreativeFactory(e.creativeFactory),t._callCreativeFactory())})},Fresh8.prototype._onHistoryPushStateChange=function(){this.reloadAllAds().catch()},module.exports=Fresh8;
//# sourceMappingURL=index.js.map
