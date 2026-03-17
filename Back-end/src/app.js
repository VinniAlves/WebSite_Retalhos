const express = require('express');

const cors = require('cors');

const app = express();

const index = require('./routes/index')

const path = require("path");

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const markRoutes = require('./routes/marca.routers');
const modelRoutes = require('./routes/modelo.routers');
const vehicleRoutes = require('./routes/veiculos.routes');
const imageRoutes = require('./routes/image.routes')

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.json({type:'application/vnd.api+json'}));
app.use(cors());

app.use(index);
app.use('/retalhos.cascavel/', productRoutes);
app.use('/retalhos.cascavel/', categoryRoutes);
app.use('/retalhos.cascavel/', markRoutes);
app.use('/retalhos.cascavel/', modelRoutes);
app.use('/retalhos.cascavel/', vehicleRoutes);
app.use('/retalhos.cascavel/', imageRoutes);
app.use("/retalhos.cascavel/imagens", express.static(path.join(__dirname, "..", "uploads")));

module.exports = app;