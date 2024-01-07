const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const { successResponse, errorResponse } = require("../utils/response")
const bycrypt = require('bcryptjs')
const multer = require('multer')
const sharp = require('sharp')

router.post('/user/register', async (req, res) => {
    const user = new User({
        ...req.body,
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
        'email'
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

router.post('/user/avatar/:id', auth, (req, res, next) => {
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
        const user = await User.findById(req.params.id);
        user.avatar = buffer;
        await user.save();
        res.status(200).send(successResponse('OK', {}, res.statusCode));
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode));
    }
});

router.get('/user/avatar/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.set('Content-Type', 'image/png')
        return res.status(200).send(successResponse("OK", { avatar: user.avatar }, res.statusCode))
    } catch (error) {
        res.status(400).send(errorResponse(error.toString(), res.statusCode))
    }
})

router.delete('/user/avatar/:id', auth, async (req, res) => {
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


module.exports = router