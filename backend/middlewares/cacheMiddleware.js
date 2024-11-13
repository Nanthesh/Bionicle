// cacheMiddleware.js
const redisClient = require('../database/redisClient');

const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;
    console.log('Cache Key:', key);
    res.locals.cacheKey = key; // Store the cache key for later use in the controller

    try {
        redisClient.get(key, (err, cachedData) => {
            if (err) {
                console.error('Redis Get Error:', err);
                return next(); // Continue if there's an error
            }

            if (cachedData) {
                console.log('Cache Hit:', key);
                console.log('Cached Data:', JSON.parse(cachedData));
                return res.status(200).json(JSON.parse(cachedData)); // Send cached data if found
            }

            // Proceed to controller if no cached data is found
            next();
        });
    } catch (error) {
        console.error('Cache Middleware Error:', error);
        next();
    }
};

module.exports = cacheMiddleware;
