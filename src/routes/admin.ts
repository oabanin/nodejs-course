import {deleteProduct, getAddProduct, getProducts, getEditProduct} from "../controllers/admin";

const path = require('path');

import express from "express";

import {check, body} from "express-validator";

const adminController = require('../controllers/admin');
import {isAuth} from "../middleware/is-auth";

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);

router.get('/products', isAuth, getProducts);

router.post('/add-product', [
        body('title')
            .isString()
            .isLength({min: 3})
            .trim(),
        body('price', 'price has to be valid.')
            .isFloat(),
        body('description', 'description has to be valid.')
            .trim()
            .isLength({min: 1, max: 400}),
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product', [
        body('title')
            .isString()
            .isLength({min: 3})
            .trim(),
        body('price', 'Password has to be valid.')
            .isFloat(),
        body('description', 'Password has to be valid.')
            .trim()
            .isLength({min: 5, max: 400}),
    ],
    isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, deleteProduct);

export {router}
