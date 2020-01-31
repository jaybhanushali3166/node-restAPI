const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req,res,next)=>{
   
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
}


exports.products_get_product = (req,res,next)=>{
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
}

exports.products_create_product = (req,res,next)=>{
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
    
}


exports.products_update_product = (req,res,next)=>{
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
}


exports.products_delete_product = (req,res,next)=>{
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
}