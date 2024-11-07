import error from './error.js';

class ApiError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.message = message ? message : error[code] || 'internal server error';
		this.isApiError = true;
		console.log(this.message);
	}
	static conflict(msg, metadata = {}) {
		return new ApiError(409, msg, metadata);
	    }

	static unauthorized(msg) {
		console.log("here 19 ",msg)

		return new ApiError(401, msg);
	}
	static badRequest(msg) {
		return new ApiError(400, msg);
	}
	static internal(msg) {
		return new ApiError(500, msg);
	}
	static notFound(msg) {
		return new ApiError(404, msg);
	}
	static userBlocked(msg) {
		return new ApiError(503, msg);
	}
	static userSocialLoginExist(msg) {
		return new ApiError(503, msg);
	}
	
   static conflict(msg, metadata = {}) {
        return new ApiError(409, msg, metadata);
    }
}

export default error;
