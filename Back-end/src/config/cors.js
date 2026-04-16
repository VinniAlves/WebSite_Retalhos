const parseOrigins = () => {
  const origins = process.env.CORS_ALLOWED_ORIGINS;

  if (!origins) return [];

  return origins.split(",").map(origin => origin.trim());
};

const corsConfig = {
  allowedOrigins: parseOrigins(),

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With"
  ],

  credentials: true, 
  optionsSuccessStatus: 200 
};

module.exports = { corsConfig};