const express = require('express')
const router = express.Router()

const User = require('../models/User') //Utilizamos el schema

router.get('/users/signin', (req,res)=>{
    res.render('users/signin')
})

router.get('/users/signup', (req,res)=>{
    res.render('users/signup')
})

router.post('/users/signup', async (req,res)=>{
    const {name,email,password,confirmPassword} = req.body;
    const errors = [];
    if(password !== confirmPassword){
        errors.push({text:'Password do not match'})
    }
    if (password.length < 4){
        errors.push({text:'Password must be at least 4 characters'})
    }

    if(errors.length >0){
        res.render('users/signup',{errors, name, email, password, confirmPassword})
    } else{
        const emailUser = await User.findOne({email: email})

        if(emailUser){
            //req.flash('error_msg', 'The Email is already used')
            res.redirect('/users/signup')
        } else{

            
            const newUser = new User({name, email, password});
            newUser.password =  await newUser.encryptPassword(password)
            await newUser.save()
            res.redirect('/users/signin')
        }
        }
})
module.exports = router