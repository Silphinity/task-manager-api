const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "Password" in any form')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        },
        default: 0
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Email '+value+' is not a valid email address.')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//Virtual Property - Not actual data, but a relationship between 2 entities

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//statics on model, methods on instances

//Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error({error: 'Unable to login'})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error({error: 'Unable to login'})
    }

    return user
}

//Hash the Password
userSchema.pre('save', async function (next) {
    //need .this, arrow function don't bind .this
    const user = this
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //This tells the program we are done, even async stuff, and let's save the resource
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User