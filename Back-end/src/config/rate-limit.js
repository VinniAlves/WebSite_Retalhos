const  rateLimit = require("express-rate-limit");

 const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

 const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  message: {
    error: "LOGIN_RATE_LIMIT",
    message: "Muitas tentativas de login."
  }
});


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});


module.exports = { globalLimiter, loginLimiter, apiLimiter };