import express from "express";
import path from "path";
import {rootDir} from "../util/path";
import {getAddProduct, postAddProduct} from "../controllers/old_shop";

const routerAdmin = express.Router();

// router.use('/add-product', (req, res, next) => {
//     res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
// });

// routerAdmin.get('/add-product', (req, res, next) => {
//     res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
// });
//
// routerAdmin.post('/product', (req, res, next) => {
//     res.redirect('/');
// });

// /admin/add-product => GET
// routerAdmin.get('/add-product', (req, res, next) => {
//     res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
// });
//
// routerAdmin.get('/add-product', (req, res, next) => {
//     res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
// });





// /admin/add-product => GET
// routerAdmin.get('/add-product', (req, res, next) => {
//     res.render('add-product', {
//         pageTitle: 'Add Product',
//         path: '/admin/add-product',
//         formsCSS: true,
//         productCSS: true,
//         activeAddProduct: true
//     });
// });


routerAdmin.get('/add-product', getAddProduct);

// /admin/add-product => POST
// routerAdmin.post('/add-product', (req, res, next) => {
//     products.push({ title: req.body.title });
//     res.redirect('/');
// });

routerAdmin.post('/add-product', postAddProduct);

export {routerAdmin}


