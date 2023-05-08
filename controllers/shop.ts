import {Product} from "../models/product";
import {Cart} from "../models/cart";

const getProducts = (req: any, res: any) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(console.log)
};

const getProduct = (req: any, res: any) => {
    const prodId = req.params.productId;
    console.log('dsd')
};

const getIndex = (req: any, res: any) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(console.log)
};

const getCart = (req: any, res: any) => {

};

const postCart = (req: any, res: any) => {
    const prodId = req.body.productId;
    console.log('dsd')
    res.redirect('/cart');
};

const postCartDeleteProduct = (req: any, res: any) => {
    const prodId = req.body.productId;
    console.log('dsd')
};

const getOrders = (req: any, res: any) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

const getCheckout = (req: any, res: any) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

export {getCheckout, getProducts, getProduct, postCartDeleteProduct, postCart, getCart, getOrders, getIndex}