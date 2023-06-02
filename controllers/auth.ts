import {User} from "../models/user";

const getLogin = (req: any, res: any) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

const postLogin = (req: any, res: any) => {
    User.findById('646bdbc2e7916f6d94bfedb0')
        .then(async (user: any) => {
            //res.setHeader("Set-Cookie", 'loggedIn=true')
            req.session.isLoggedIn = true;
            req.session.user = user;
            await req.session.save();
            res.redirect('/');
        });



};

const postLogout = async(req: any, res: any) => {
    //res.setHeader("Set-Cookie", 'loggedIn=true')
    await req.session.destroy();
    res.redirect('/');
};

export {getLogin, postLogin, postLogout}