const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middlewares/check-auth');

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

const upload = multer({storage: storage, fileFilter: fileFilter, limits : { fileSize: 1024*1024*5}});

// database model import (Product)
const Product = require('../models/product');

// url
// const apiURL= 'http://localhost:4000/';

// Routes for GET,POST,PATCH,DELETE

router.get('/',(req,res,next)=>{
   
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs =>{
        const response= {
            count : docs.length,
            products: docs.map( doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request :{
                        type : 'GET',
                        url : 'http://localhost:4000/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
      //  res.status(200).json(storage.destination)
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
        
    })
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    
    const product= new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Created Product succesfully",
            createdProduct : {
                name : result.name,
                _id: result._id,
                request :{
                    type: 'GET',
                    url:  'http://localhost:4000/products/'+result._id
                }
            }
    
        });
    }).catch( err=>{
        console.log(err);
        res.status(500).json({
            message:storage.destination,
            error: err
        })
    });
    
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log("from database:",doc);
        if(doc) {
            res.status(200).json({
                product: doc,
                request:{
                    type: 'GET',
                    description : '',
                    url:  'http://localhost:4000/products/'+doc._id
                }
            })
        }
        else {
            res.status(404).json({
                message : "NO valid entry found for  this Id"
            });
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err})
    })
});

router.patch('/:productId',(req,res,next)=>{
    const updateOps = {};
    const id =req.params.productId
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id }, { $set : updateOps })
    .exec()
    .then( result =>{
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request:{
                type:'GET',
                url:  'http://localhost:4000/products/'+id
            }
        })
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
});

router.delete('/:productId',(req,res,next)=>{
    Product.remove({_id : req.params.productId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url : 'http://localhost:4000/products',
                body: { name: 'String', price: 'Number' }
            }
        })
    })
    .catch( err=>{
        console.log(err);
        res.send(500).json({
            error: err
        });
    });
});

module.exports= router;