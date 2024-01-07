const mongoose = require('mongoose')

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    otp: {
        type: String,
        default: null,
    },
},
    {
        timestamps: true
    })

otpSchema.methods.toJSON = function () {
    const otp = this
    const otpObject = otp.toObject()

    delete otpObject.__v

    return otpObject
}

otpSchema.pre('save', async function (next) {
    //this means this user.
    const user = this
    next()
})

const Otp = mongoose.model('Otp', otpSchema)

module.exports = Otp 