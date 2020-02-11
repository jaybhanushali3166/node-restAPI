const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const User = require('../models/user');


//Route Requests
router.post('/signup', (req, res, next) => {

    User.find({email:req.body.email})
    .exec()
    .then( user =>{
        if(user.length>=1){
            return res.status(409).json({
                message:"Mail Exists"
            });
        }
        else
        {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                console.log("in signup api");
                
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User Created"
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
        
                }
            });

        }
    })
});


router.post('/login',(req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then( user =>{
        if(user.length < 1){
            res.status(401).json({
                message:"Auth Failed"
            });
        }
        else
        {
            bcrypt.compare(req.body.password,user[0].password, (err,result)=>{
                if(err){
                    return res.status(401).json({
                        message:"Auth Failed"
                    });
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId:user[0]._id
                    },
                        process.env.JWT_KEY,
                    {
                        expiresIn:"10hr"
                    }
                    );
                    return res.status(200).json({
                        message:"Auth Successful",
                        token:token
                    });
                }
            });
        }
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.delete('/:userId',(req,res,next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then( result =>{
        res.status(200).json({
            message:"User Deleted"
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;