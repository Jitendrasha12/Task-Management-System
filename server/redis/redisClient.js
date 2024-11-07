const redis =  require('redis');

const options = {
	host: process.env.REDIS_HOST,
	Port: process.env.REDIS_PORT,
	no_ready_check: true,
};

const redisClient = redis.createClient(options);
module.exports = redisClient;
