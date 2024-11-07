const apiErrorhandler = (err, req, res, next) => {
	console.log(err, "Error From Middleware.")
	if (err.isApiError) {
		console.log("here 5,",err.code)

		res.status(err.code).json({
			statusCode: err.code,
			message: err.message,

		});
		return;
	}
	if (err.message == 'Validation error') {
		res.status(502).json({
			statusCode: 502,
			message: err.original.message,
		});
		return;
	}
	if (err.message == 'Unauthorized') {
		res.status(502).json({
			statusCode: 401,
			message: err.message,
		});
		return;
	}
	res.status(err.code || 500).json({

		statusCode: err.code || 500,
		message: err.message,
	});
	console.log("here 9 ,",err)

	return;
};

module.exports = apiErrorhandler;
