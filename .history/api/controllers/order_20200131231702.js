const Order = require('../models/order')

exports.orders_get_all =  (req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
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
        res.status(500).json({
            message: {
                error: err
            }
        });
    });
}

exports.orders_create_order =  (req,res,next)=>{
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
        res.status(201).json({
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
}

// exports.orders_get_order = 

