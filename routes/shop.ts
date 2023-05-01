import express from "express";
import path from "path";
const routerApp = express.Router();
const adminData = require('./admin');

// routerApp.use('/', (req, res, next) => {
//     res.send('<h1>Hello from Express!</h1>');
// });
// routerApp.get('/', (req, res, next) => {
//     res.send('<h1>Hello from Express!</h1>');
// });

// routerApp.get('/', (req, res, next) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
// });

routerApp.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
});



export {routerApp}