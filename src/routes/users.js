const express = require('express')
const passport = require('passport')
const router = express.Router()

const User = require('../models/User') //Utilizamos el schema

router.get('/users/signin', (req,res)=>{
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

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
            req.flash('error_msg', 'The Email is already used')
            //req.flash('success_msg', 'User already exists')
            res.redirect('/users/signup')
        } else{

            
            const newUser = new User({name, email, password});
            newUser.password =  await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg', 'User registered successfully')
            res.redirect('/users/signin')
        }
        }
})

router.get('/users/logout',(req,res) => {
    req.logout()
    res.redirect('/')
})
module.exports = router