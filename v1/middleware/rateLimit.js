const rateLimit = require('express-rate-limit');

const limitWindow = process.env.LIMIT_WINDOW || 5;
const maxRequests = process.env.MAX_REQUESTS | 10;
const getRecordLimiter = rateLimit({
  windowMs: limitWindow * 60 * 1000, 
  max: maxRequests, 
  message: `Too many requests from this IP, please try again after ${limitWindow} minutes`
});

module.exports = {
  getRecordLimiter
};


