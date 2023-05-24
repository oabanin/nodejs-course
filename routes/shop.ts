import {getIndex, getProducts, getProduct, getCheckout, postCart, getCart, postOrder, postCartDeleteProduct, getOrders} from "../controllers/shop";

import path from "path";

import express from "express";


const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);
//
// router.post('/cart-delete-item', postCartDeleteProduct);
//
// router.post('/create-order', postOrder);
//
// router.get('/orders', getOrders);

export {router}
