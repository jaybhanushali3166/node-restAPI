const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middlewares/check-auth');
const orderController = require('../controllers/order')

const Order= require('../models/order');
const Product = require('../models/product');


router.get('/',checkAuth , orderController.orders_get_all);

router.post('/',checkAuth,orderController.orders_create_order);

router.get('/:orderId',checkAuth, orderController.orders_get_order);

router.delete('/:orderId',checkAuth, (req,res,next)=>{
 Order.remove({_id: req.params.orderId})
 .exec()
 .then(result =>{
     res.status(200).json({
         message: 'Order Deleted',
         request: {
             type: 'POST',
             url: "http://localhost:3000/orders",
             body : { productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch( err =>{
        console.log(err);
        return res.status(500).json({
            message: "Product not found"
        });
    }); 
})

module.exports=router;
