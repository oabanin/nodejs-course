import path from "path";
import express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import {get404} from "./controllers/error";
import {User} from "./models/user";
import session from "express-session";
import connectMongodbSession from "connect-mongodb-session";

const MONGODB_URI = 'mongodb+srv://juristoleh:We7pl3E18bUFzya@cluster0.srse5oy.mongodb.net/shop';

const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({uri: MONGODB_URI, collection: "sessions"});

import {router as shopRoutes} from "./routes/shop";
import {router as adminRoutes} from "./routes/admin"
import {router as authRoutes} from "./routes/user";

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: "12345", resave: false, saveUninitialized: false, store}))

app.use((req: any, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findById(req.session.user._id)
            .then((user: any) => {
                req.user = user
                next();
            });
    }

})
// app.use((req: any, res, next) => {
//     User.findById('646bdbc2e7916f6d94bfedb0')
//         .then((user: any) => {
//             req.user = user
//             next();
//         });
// })


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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