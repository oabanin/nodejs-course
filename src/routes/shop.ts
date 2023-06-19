import {
    getIndex,
    getProducts,
    getProduct,
    getCheckout,
    postCart,
    getCart,
    postOrder,
    postCartDeleteProduct,
    getOrders, getInvoice, getCheckoutSuccess
} from "../controllers/shop";

import path from "path";

import express from "express";
import {isAuth} from "../middleware/is-auth";

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);

router.get('/orders/:orderId', isAuth, getInvoice);


router.get('/checkout', isAuth, getCheckout);

router.get('/checkout/success', getCheckoutSuccess);

router.get('/checkout/cancel', getCheckout);


export {router}
