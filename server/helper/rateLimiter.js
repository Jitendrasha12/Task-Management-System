import rateLimit from 'express-rate-limit'

 const Limiter  = rateLimit({
    windowMs: 60 * 1000,
    max: 3, // Limit each IP to 3 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode : 429 ,
    skipFailedRequests: false, // Do not count failed requests (status >= 400)
    message: {
        status : 429,
        message : ' Too many wrong attempts, please try again after 1 minute'
       },
       keyGenerator: (req, res) => {
		console.log("req.clientIp" , req.body.ip);
		return req.body.ip
	  }
})
export { Limiter as default }
