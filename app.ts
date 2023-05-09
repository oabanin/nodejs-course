import path from "path";
import {sequelize} from "./util/database";
import express from "express";
import * as bodyParser from "body-parser";

import {get404} from "./controllers/error";
import {router as shopRoutes} from "./routes/shop";

import {router as adminRoutes} from "./routes/admin"
import {Product} from "./models/product";
import {User} from "./models/user";

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
//OR
// User.hasMany(Product)
//Product.sync();
sequelize.sync({force: true})
    .then(result => {
        app.listen(3000);
    })
    .catch(console.log); //sync models to databates


