import path from "path";
import express, {Request} from "express";
import * as bodyParser from "body-parser";
import {mongoConnect} from "./util/database";
import {get404} from "./controllers/error";
import {User} from "./models/user";


import {router as shopRoutes} from "./routes/shop";
import {router as adminRoutes} from "./routes/admin"

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req: any, res, next) => {
    User.findById('6463416c9c0fdc9f42aaad11')
        .then((user:any) => {
            req.user = new User(user.name, user.email, user.cart, user?._id);
            next();
        });
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect(() => {
    app.listen(3000);
});