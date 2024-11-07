export default class ErrorHandler {
	constructor({
		logMethod,
		shouldLog = false,
	}) {
		this.shouldLog = shouldLog;
		this.logMethod = logMethod;
	}

    /**
     */
	unhandledRequest() {
		return (req, res, next) => {
			if (!res.headersSent) {
				// Handle unhandled requests
				return res.status(501).json({
					message: 'Request is not handled',
					error: 'Not Implemented',
					statusCode: 501,
				});
			}
			return next();
		};
	}
}