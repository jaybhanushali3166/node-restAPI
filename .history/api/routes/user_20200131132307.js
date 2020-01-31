const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User= require('../models/user');

router.post('/signup',(req,res,next) =>{

    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
                return res.status(500).json({
                    error: err
                });
            }
            else
            {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email : req.body.email,
                    password : hash
            });
        }
    });

});

module.exports = router;