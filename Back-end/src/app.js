const { globalLimiter, loginLimiter, apiLimiter }= require("./config/rate-limit");

const { corsMiddleware } = require("./middleware/corsMiddleware");
const helmet = require("helmet");

const express = require('express');

const app = express();

app.set('trust proxy', '127.0.0.1');

const index = require('./routes/index')

const path = require("path");

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const markRoutes = require('./routes/marca.routers');
const modelRoutes = require('./routes/modelo.routers');
const vehicleRoutes = require('./routes/veiculos.routes');
const imageRoutes = require('./routes/image.routes')
const AuthGoogle = require('./routes/authGoogle.routes')

app.use(corsMiddleware);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.json({type:'application/vnd.api+json'}));

app.use(index);
app.use(globalLimiter);

app.use('/retalhos.cascavel/',apiLimiter, productRoutes);
app.use('/retalhos.cascavel/',apiLimiter ,categoryRoutes);
app.use('/retalhos.cascavel/',apiLimiter, markRoutes);
app.use('/retalhos.cascavel/', apiLimiter,modelRoutes);
app.use('/retalhos.cascavel/',apiLimiter, vehicleRoutes);
app.use('/retalhos.cascavel/',apiLimiter, imageRoutes);
const uploadPath = process.env.NODE_ENV === 'production'
  ? "/server/ProjectRunning/Back-end/Uploads"
  : path.join(__dirname, "../Uploads");

app.use("/retalhos.cascavel/imagens", apiLimiter, express.static(uploadPath));
app.use("/retalhos.cascavel/",loginLimiter, AuthGoogle);

const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);


module.exports = app;