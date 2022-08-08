const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


// Handle Errors
const handleErrors = (err) => {
    console.log(err, err.code)

    let errors = { email: '', password: '' };


    // incorrect email
    if(err.message == 'incorrect Email') {
        errors.email = 'That email is not registered'
    }

    // incorrect password
    if(err.message == 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    // for duplicate email(using a registered email to register agin)
    if(err.code == 11000) {
        errors.email = 'That email is already registered';
        return errors
    }

    // validation Errors
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors
}

// creating jwt token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn: maxAge
    })
}

// @desc GET register page
// @ Public
const register_get = (req, res) => {

    res.render('register', {
        title: 'Register'
    })
    
}

// @desc POST register details
// @ Public
const register_post = async (req, res) => {

    const { name, email, password} = req.body

    
    try {
        user = await User.create({ name, email, password });

        console.log('User Created', user)
        const token = createToken(user._id)
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
        res.status(200).json({user: user.id})
    } catch (error) {
        
        const errors = handleErrors(error);
        res.status(400).json({ errors })
    }


}

// @desc GET login page
// @ Public
const login_get = (req, res) => {

    res.render('login', {
        title: 'Login'
    })

}

// @desc POST login data
// @ Public
const login_post = async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
        res.status(200).json({user})
        
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }

    
    
}

// @desc GET logout
// @ Private
const logout_get = (req, res) => {

    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/users/login')

}

module.exports = {
    register_get,
    register_post,
    login_get,
    login_post,
    logout_get
}