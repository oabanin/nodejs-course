import path from "path";
import {sequelize} from "./util/database";
import express, {Request} from "express";
import * as bodyParser from "body-parser";

import {get404} from "./controllers/error";
import {router as shopRoutes} from "./routes/shop";

import {router as adminRoutes} from "./routes/admin"
import {Product} from "./models/old/mongodb/product";
import {User} from "./models/old/mongodb/user";
import {Cart} from "./src/models/cart";
import {CartItem} from "./src/models/cart-item";
import {OrderItem} from "./models/old/mongodb/order-item";
import {Order} from "./models/old/mongodb/order";

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));



app.use(async (req, res, next) => {
    // @ts-ignore
    req.user = await User.findByPk(1);
    next();
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product) //adds specials association methods
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through:CartItem})
Product.belongsToMany(Cart, {through:CartItem})
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

sequelize
    .sync()
    //.sync({force: true})
    .then(async (result) => {
        const user = await User.findByPk<any>(1);
        if(!user)
        {
            await User.create({name: "Max", email: "test@test.com"});
        }
        app.listen(3000);
    })
    .catch(console.log); //sync models to databates


