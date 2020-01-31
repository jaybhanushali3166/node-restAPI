const express = require('express');
const app= express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// route paths
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// database connection
mongoose.connect('mongodb+srv://jayb316:' +process.env.MONGO_ATLAS_PW+ '@node-rest-shop-tjblp.mongodb.net/test?retryWrites=true&w=majority',
{ useNewUrlParser: true });

mongoose.Promise = global.Promise;

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));

// CORS error preventions
app.use((req,res,next)=>{
    res.header("Acess-Control-Allow-Origin","*");
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method=='OPTIONS') {
      res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,GET');
      return res.status(200).json({});  
    }
    next();
})

// Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

// Error handling
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports=app;