import path from "path";
import express from "express";
import multer from "multer";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import {get404, get500} from "./controllers/error";
import {User} from "./models/user";
import session from "express-session";
import connectMongodbSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash"
import {router as shopRoutes} from "./routes/shop";
import {router as adminRoutes} from "./routes/admin"
import {router as authRoutes} from "./routes/user";
import 'dotenv/config'

export const MONGODB_URI = process.env.MONGODB_URI|| ''
//NEED to add tight

const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({uri: MONGODB_URI, collection: "sessions"});

const csrfProtection = csrf()
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString() + "-" + file.originalname)
    }
})

const fileFilter = (req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
        callback(null, true)
    } else {
        callback(null, false)
    }

}

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage, fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({secret: "12345", resave: false, saveUninitialized: false, store}))
app.use(csrfProtection)
app.use(flash());

declare module 'express-session' {
    interface SessionData {
        user?: {
            _id: string
        }
        isLoggedIn?: boolean
    }
}

app.use(async (req: any, res, next) => {

    try {
        //throw new Error('Error inside async code should be thrown using next()');
        if (!req.session.user) return next()
        const user = await User.findById(req.session.user._id);
        if (!user) return next();
        req.user = user
        return next();
    } catch (e) {
        next(new Error(e as string))
    }
})


// app.use((req: any, res, next) => {
//     User.findById('646bdbc2e7916f6d94bfedb0')
//         .then((user: any) => {
//             req.user = user
//             next();
//         });
// })


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use((err: any, req: any, res: any, next: any) => {
    //return res.status(err.httpStatusCode).redirect('/500') // it leads to infinite loop
    //return res.redirect('/500')
    res.status(500).render('500', {pageTitle: 'Error 500', path: '/500', isAuthenticated: false});
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', get500)

app.use(get404);


mongoose.connect(MONGODB_URI)
    .then((result) => {
        // const user = new User({name: 'test', email: "test", cart: {items: []}});
        // user.save();
        app.listen(3000);
    })
    .catch(console.log)

// mongoConnect(() => {
//     app.listen(3000);
// });