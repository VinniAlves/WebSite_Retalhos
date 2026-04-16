const cors = require("cors");
const { corsConfig } = require("../config/cors");

const corsMiddleware = cors({
  origin: (origin, callback) => {

    // Permitir requests sem origin (Postman, mobile apps, etc)
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed = corsConfig.allowedOrigins.includes(origin);

    if (isAllowed) {
      return callback(null, true);
    }

    // 🚨 LOG DE SEGURANÇA
    console.warn(`[CORS BLOCKED]`);
    console.warn(`- Request Origin: "${origin}"`);
    console.warn(`- Allowed Origins: [${corsConfig.allowedOrigins.map(o => `"${o}"`).join(", ")}]`);

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },

  methods: corsConfig.methods,
  allowedHeaders: corsConfig.allowedHeaders,
  credentials: corsConfig.credentials
});

module.exports = { corsMiddleware };
