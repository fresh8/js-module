/**
 * Invailde config
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}          a new error with the correct name and message.
 */
export function invaildeConfig (message) {
  const error = new Error(message);
  error.name = 'invaildeConfig';
  return error;
}
