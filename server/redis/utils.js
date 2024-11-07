// import redisClient from './redisClient';

// /**
//  * Store a string in Redis
//  * Stores data in a key-value format
//  * @param {string} (key, value)
//  * @returns
//  */
// const set = async (key, value, expiresInSeconds=30) => {
//   console.log(key, value, "This is the key and value being set");
//   try {
//     await redisClient.set(key, value, "EX", 30);
//     console.log("Value set successfully");
//   } catch (err) {
//     console.error("Error setting value in Redis", err);
//     throw err; // rethrow the error after logging it
//   }
// };


// /**
//  * get data from key
//  * @param {string} key
//  * @returns
//  */
// const get = async (key) => {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };


// /**
//  * Store a Javascript Object in Redis
//  * Stores data in a key-value format
//  * @param {string, Object} (key, value)
//  * @returns
//  */
// const hmset = async (key, object, secs) => {
//     console.log('key',key,object,secs)
//     const isStore =  redisClient.hmset(key, object);
//     redisClient.expire(key, secs);
//     return isStore;
// };

// /**
//  * Get a Javascript Object from Redis
//  * get data from key
//  * @param {string} key
//  * @returns
//  */
// const hgetall = async key => {
//     console.log("hitting hgetall",key)
//     return new Promise((resolve, reject) => {
//         redisClient.hgetall(key, (err, object) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(object);
//             }
//         });
//     });
// };



// module.exports = {
//     set,
//     get,
//     hmset,
//     hgetall,
// };

