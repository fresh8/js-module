/**
 * Adds customEvent method to the window if it doesn't already exist.
 */
export function customEvent () {
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
export function PolyfillHistoryPushState () {
  const _historyPushState = window.history.pushState;
  const historyPushStateEvent = new CustomEvent('__f8-history-push-state');

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
    const historyPushState = _historyPushState.apply(this, arguments);
    window.dispatchEvent(historyPushStateEvent);
    return historyPushState;
  }

  return {
    restore,
    fill
  };
}
