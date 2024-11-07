/**
 * Response Model for successful response
 * @export
 * @class Response
 */
export default class Response {
  constructor(data = {}, message = "Operation completed successfully", statusCode = null) {
    this.data = data || {};
    this.message = message;
    this.statusCode = statusCode || 200;
  }
}
