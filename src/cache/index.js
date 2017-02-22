export default class Cache {
  /**
   * A basic cache store class
   */
  constructor () {
    this.cache = {};
  }

 /**
  * Set a value against a key in the store.
  * @param  {String} key   is the name that you want to store the data under.
  * @param  {*}      value is the data to you want to store.
  */
  put (key, value) {
    this.cache[key] = value;
  }

  /**
   * Remove a key/value pair from the store.
   * @param {String} key is the name of the key you want to remove.
   */
  remove (key) {
    if (this.cache[key]) {
      delete this.cache[key];
    }
  }

  /**
   * Retrieve a value from the store using a key.
   * @param  {String} key is the key you want to use to select cache value in
   *                      the store.
   * @return {*}          A cached value from the store if it exists.
   */
  get (key) {
    return this.cache[key];
  }

  /**
   * Checks if a value exists in the store.
   * @param  {String} key is the key you want to use to check a value exists for.
   * @return {Boolean}    whether the value exists or not.
   */
  exists (key) {
    if (this.cache[key]) {
      return true;
    } else {
      return false;
    }
  }
}
