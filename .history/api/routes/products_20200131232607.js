const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middlewares/check-auth');

const productController = require('../controllers/product');

const fileFilter= (req,file,cb)=>{
    // reject file
    if(file.mimetype==='image/jpeg'|| file.mimetype==='image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
   
}

// const  upload= multer({dest:' uploads/',limits :{
//     fileSize: 1024*1024*5
// },
//     fileFilter: fileFilter
// }); // can be conifigured as per required

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(' uploads/'));
    },
    filename: function(req,file,cb){
        cb(null,file.originalname+'-'+Date.now())
    }
});

const upload = multer(
    {   storage: storage, 
        fileFilter: fileFilter, 
        limits : 
        { 
            fileSize: 1024*1024*5
        }
    });

// database model import (Product)
const Product = require('../models/product');

// url
// const apiURL= 'http://localhost:4000/';

// Routes for GET,POST,PATCH,DELETE

router.get('/',checkAuth,productController.products_get_all);

router.post('/',checkAuth, upload.single('productImage'),productController.products_create_product);

router.get('/:productId',checkAuth, productController.products_get_product);

router.patch('/:productId',checkAuth,productController.products_update_product );

router.delete('/:productId',checkAuth, productController.products_delete_product);

module.exports= router;