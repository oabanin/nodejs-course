import express from "express";
import {User} from "../models/user";

import {
    getLogin,
    getNewPassword,
    getReset,
    getSignUp,
    postLogin,
    postLogout,
    postNewPassword,
    postReset,
    postSignUp
} from "../controllers/auth";

import {check, body} from "express-validator";

const router = express.Router();

router.get('/login', getLogin);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
    ], postLogin);

router.post('/logout', postLogout);

router.get('/signup', getSignUp);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage("Wrong email")
            .custom(async (value, {req}) => {
                // if (value === "test@test.com") {
                //     throw new Error("test is fobidden")
                // }
                // return true

                const user = await User.findOne({email: value});
                if (user) {
                    return Promise.reject('Email already exist')
                }
                return true;

            })
            .normalizeEmail(),
        body('password', "password 2 min")
            .isLength({min: 2})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords have to match")
                }
                return true
            })
    ], postSignUp);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password', postNewPassword)


export {router}
