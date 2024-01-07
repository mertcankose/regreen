const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Otp = require('../models/otp')
const auth = require('../middleware/auth')
const { successResponse, errorResponse } = require("../utils/response")
const bycrypt = require('bcryptjs')
const multer = require('multer')
const sharp = require('sharp')
const { generateOTP } = require('../utils/otp')
const { sendEmail } = require('../utils/mail_send')

router.post('/user/register', async (req, res) => {
    const otpGenerated = generateOTP();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);
    const user = new User({
        ...req.body,
        otp: otpGenerated,
        otpExpiration: otpExpiration,
        active: true
    })
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send(successResponse("OK", { user, token }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user.active) {
            return res.status(400).send(errorResponse("Please validate your OTP!", res.statusCode))
        }

        user.clearOTP();

        const token = await user.generateAuthToken()
        await user.save()
        res.send(successResponse("OK", { user, token }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200).send(successResponse("Logged out from current session.", {}, res.statusCode))
    } catch (error) {
        res.status(500).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(successResponse("Logged out from all sessions.", {}, res.statusCode))
    } catch (error) {
        res.status(500).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.get('/user/me', auth, async (req, res) => {
    try {
        res.send(successResponse("OK", { profile: req.user }, res.statusCode))
    } catch (error) {
        res.status(500).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'username',
    ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send(errorResponse('Invalid update fields!', res.statusCode))
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(successResponse("OK", { profile: req.user }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000 // 1mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)) {
            const error = new Error('These are acceptable: PNG, JPG, and JPEG');
            error.statusCode = 400;
            return cb(error);
        }

        cb(null, true);
    }
});

router.post('/user/avatar', auth, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err) {
            return res.status(err.statusCode || 400).send(errorResponse(err.message, res.statusCode));
        }

        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send(errorResponse("There is no avatar", res.statusCode));
        }

        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        const user = await User.findById(req.user._id);
        user.avatar = buffer;
        await user.save();
        res.status(200).send(successResponse('OK', {}, res.statusCode));
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode));
    }
});

router.get('/user/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.set('Content-Type', 'image/png')
        return res.status(200).send(successResponse("OK", { avatar: user.avatar }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.delete('/user/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.avatar = null
        await user.save()
        res.send(successResponse("User's avatar deleted successfully.", {}, res.statusCode))
    } catch (error) {
        res.status(500).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/change-password', auth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;

        const isMatch = await bycrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send(errorResponse("Old password is'nt correct!", res.statusCode));
        }

        user.password = newPassword;
        await user.save();

        res.send(successResponse("OK", {}, res.statusCode));
    } catch (error) {
        res.status(500).send(errorResponse(error.toString(), res.statusCode));
    }
});

router.post('/user/change-email', auth, async (req, res) => {
    try {
        const user = req.user;
        const { password, email } = req.body;

        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send(errorResponse("Password is'nt correct!", res.statusCode));
        }

        user.email = email;
        await user.save();

        res.send(successResponse("OK", {}, res.statusCode));
    } catch (error) {
        res.status(500).send(errorResponse(error.toString(), res.statusCode));
    }
});
router.post('/user/send-otp-code', async (req, res) => {
    const otpGenerated = generateOTP();
    const otpObject = new Otp({
        email: req.body.email,
        otp: otpGenerated,
    })
    try {
        const toEmail = req.body.email;
        const emailSubject = `OTP Verification`;
        const emailText = `Your OTP Code for ReGreen: ${otpGenerated}`;
        sendEmail(toEmail, emailSubject, emailText);
        otpObject.save();
        res.status(200).send(successResponse("OK", { otp: otpGenerated }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/send-otp-code-again', async (req, res) => {
    const otpGenerated = generateOTP();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);
    try {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            return res.status(400).send(errorResponse("User not found.", res.statusCode))
        }
        user.otp = otpGenerated
        user.otpExpiration = otpExpiration
        await user.save()

        const toEmail = req.body.email;
        const emailSubject = `OTP Verification`;
        const emailText = `Your OTP Code for ReGreen: ${otpGenerated}`;
        sendEmail(toEmail, emailSubject, emailText);

        res.status(200).send(successResponse("OK", { otp: user.otp }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.post('/user/validate-otp', async (req, res) => {
    try {
        const otpObject = await Otp.findOne({
            email: req.body.email,
        });

        if (!otpObject) {
            return res.status(400).send(errorResponse("Otp not found!", res.statusCode));
        }

        if (otpObject.otp !== req.body.otp) {
            return res.status(400).send(errorResponse("Invalid OTP!", res.statusCode));
        }

        res.status(200).send(successResponse("Successful", res.statusCode));
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode));
    }
});

router.post('/user/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send(errorResponse("User not found.", res.statusCode));
        }

        const otpGenerated = generateOTP();
        const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);

        user.otp = otpGenerated;
        user.otpExpiration = otpExpiration;
        await user.save();

        const toEmail = user.email;
        const emailSubject = `Password Reset OTP`;
        const emailText = `Your OTP Code for ReGreen Password Reset: ${otpGenerated}`;
        sendEmail(toEmail, emailSubject, emailText);

        res.status(200).send(successResponse("OK", { otp: user.otp }, res.statusCode));
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode));
    }
});

router.post('/user/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send(errorResponse("User not found.", res.statusCode));
        }

        if (user.otpExpiration && user.otpExpiration < new Date()) {
            return res.status(400).send(errorResponse("OTP has expired!", res.statusCode));
        }

        if (user.otp !== otp) {
            return res.status(400).send(errorResponse("Invalid OTP!", res.statusCode));
        }

        // Update password and clear OTP fields
        user.password = newPassword;
        user.otp = null;
        user.otpExpiration = null;

        await user.save();

        const token = await user.generateAuthToken();
        res.status(200).send(successResponse("OK", { user, token }, res.statusCode));
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode));
    }
});

module.exports = router