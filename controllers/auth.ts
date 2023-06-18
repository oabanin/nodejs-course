import {User} from "../models/user";
import {compare, hash} from "bcryptjs";
import {createTransport} from "nodemailer";
import {validationResult} from "express-validator";
import * as crypto from "crypto";

// @ts-ignore
import sendgridTransport from "nodemailer-sendgrid-transport";

const transporter = createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));
const getLogin = (req: any, res: any) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error').length > 0 && req.flash('error'),
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
};

const postLogin = async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    const user = await User.findOne({email});


    if (!user) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: []
        });
    }
    const isPassValid = await compare(password, user.password);
    if (!isPassValid) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: []
        });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    return res.redirect('/');
};

const postLogout = async (req: any, res: any) => {
    //res.setHeader("Set-Cookie", 'loggedIn=true')
    await req.session.destroy();
    res.redirect('/');
};

const getSignUp = (req: any, res: any) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('error'),
        oldInput: {email: "", password: "", confirmPassword: ""},
        validationErrors:[]
    });
};

const postSignUp = async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {email, password, confirmPassword: req.body.confirmPassword},
            validationErrors:errors.array()
        });
    }
    //BEtteR TO MOVE IN VALIDATOR
    // const userDoc = await User.findOne({email})
    // if (userDoc) {
    //     req.flash('error', 'Already exist')
    //     return res.redirect('/signup');
    // }
    const hashedPass = await hash(password, 12);
    const user = await new User({email, password: hashedPass, cart: {items: []}}).save();
    res.redirect('/');
    return transporter.sendMail({
        to: email,
        from: "juristoleh@gmail.com",
        subject: "Sign-up succeeded",
        html: "<h1>You successfully signed up</h1>"
    })
};

const getReset = (req: any, res: any) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: req.flash('error')
    });
};

const postReset = (req: any, res: any) => {
    crypto.randomBytes(32, async (err, buf) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset')
        }

        const token = buf.toString('hex');
        const user = await User.findOne({email: req.body.email})
        // console.log(token);

        if (!user) {
            req.flash('error', 'No account with email');
            return res.redirect('/reset')
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
        res.redirect('/')
        await transporter.sendMail({
            to: req.body.email,
            from: "juristoleh@gmail.com",
            subject: "Password reset",
            html: `<h1>Password reset</h1><a href="http://localhost:3000/reset/${token}">Click to reset password</a>`
        })
    })

};


const getNewPassword = async (req: any, res: any) => {
    const token = req.params.token;
    const user = await User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}});
    if (!user) {
        req.flash('error', 'Invalid token')
        return res.redirect('/login');
    }

    res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'new password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token,
    });
};

const postNewPassword = async (req: any, res: any, next: any) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    const user = await User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId});
    if (user) {
        user.password = await hash(newPassword, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.redirect('/login');
    }
}

export {getLogin, postLogin, postLogout, getSignUp, postSignUp, getReset, postReset, getNewPassword, postNewPassword}