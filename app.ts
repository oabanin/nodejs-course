import path from "path";
import express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
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
    User.findById('646bdbc2e7916f6d94bfedb0')
        .then((user: any) => {
            req.user = user
            next();
        });
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose.connect('mongodb+srv://juristoleh:We7pl3E18bUFzya@cluster0.srse5oy.mongodb.net/shop?retryWrites=true&w=majority')
    .then((result) => {
        // const user = new User({name: 'test', email: "test", cart: {items: []}});
        // user.save();
        app.listen(3000);
    })
    .catch(console.log)

// mongoConnect(() => {
//     app.listen(3000);
// });