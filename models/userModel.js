const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please fill in your name"]
    },
    email: {
        type: String,
        required: [true, "Please add a valid Email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters']
    }
})

// hashing password before saving
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static for logging in
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email: email});

    if(user) {
        const auth = await bcrypt.compare(password, user.password)

        if(auth) {
            return user
        }
        throw new Error("incorrect password")
    }

    throw new Error("incorrect Email")
}

const User = mongoose.model('user', userSchema)

module.exports = User;