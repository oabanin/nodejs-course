import path from "path";
import express from "express";

const adminController = require('../controllers/admin');

const routerAdmin = express.Router();

// /admin/add-product => GET
routerAdmin.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
routerAdmin.get('/products', adminController.getProducts);

// /admin/add-product => POST
routerAdmin.post('/add-product', adminController.postAddProduct);

routerAdmin.get('/edit-product/:productId', adminController.getEditProduct);

routerAdmin.post('/edit-product', adminController.postEditProduct);

routerAdmin.post('/delete-product', adminController.postDeleteProduct);

export {routerAdmin}
