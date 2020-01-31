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

