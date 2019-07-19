const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// database model import
const Product = require('../models/product');

// Routes for GET,POST,PATCH,DELETE

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs =>{
        const response= {
            count : docs.length,
            products: docs.map( doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request :{
                        type : 'GET',
                        url : 'http://localhost:4000/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
        
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
        
    })
});

router.post('/',(req,res,next)=>{

    const product= new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
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
            error: err
        })
    });
    
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id')
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
    })
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