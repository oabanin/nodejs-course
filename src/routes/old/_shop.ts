import express from "express";
import path from "path";
const routerApp = express.Router();
import {getProducts} from "../../controllers/old/file/old_shop";

// routerApp.use('/', (req, res, next) => {
//     res.send('<h1>Hello from Express!</h1>');
// });
// routerApp.get('/', (req, res, next) => {
//     res.send('<h1>Hello from Express!</h1>');
// });

// routerApp.get('/', (req, res, next) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
// });

// routerApp.get('/', (req, res, next) => {
//     res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
// });

routerApp.get('/', getProducts);


export {routerApp}