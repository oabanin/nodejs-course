import path from "path";

import express from "express";

import {getIndex, getProducts, getProduct, getCheckout, postCartDeleteProduct , postCart, getCart, getOrders} from "../controllers/shop";

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

export {router}
