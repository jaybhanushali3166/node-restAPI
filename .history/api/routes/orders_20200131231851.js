const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const orderController = require('../controllers/order')

const Order= require('../models/order');
const Product = require('../models/product');


router.get('/',checkAuth , orderController.orders_get_all);

router.post('/',checkAuth,orderController.orders_create_order);

router.get('/:orderId',checkAuth, orderController.orders_get_order);

router.delete('/:orderId',checkAuth, orderController.order_delete_order)

module.exports=router;
