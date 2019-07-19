const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order= require('../models/order');
const Product = require('../models/product');


router.get('/',(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            order: docs.map( doc=>{
                return {
                    _id : doc.id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request :{
                        type : 'GET',
                        url : 'http://localhost:4000/orders/'+ doc._id
                    }

                }
            })
        })
    })
    .catch(err =>{
        res.status(200).json({
            message: {
                error: err
            }
        });
    });
});

router.post('/',(req,res,next)=>{
    console.log("Hello")
    Product.findById(req.body.productId)
    .then(product =>{
        
        if(!product){
            
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product : req.body.productId
    
        });
        return order.save()
    })
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: 'Order stored',
            createdOrder :{
              _id: result._id,
              product: result.product,
              quantity: result.quantity
            },
            request : {
                type: 'GET',
                url: 'http://localhost:4000/orders/' + result._id
            }
        })
    })
    .catch( err =>{
        console.log(err);
        return res.status(500).json({
            message: "Product not found"
        });
    });   
});

router.get('/:orderId',(req,res,next)=>{
    res.status(201).json({
        message: 'Order details',
        orderId:req.params.orderId
    });
});

router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message: 'Order was deleted',
        orderId:req.params.orderId
    });
});


module.exports=router;
