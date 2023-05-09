import {_old_product} from "../models/ownmodel/_old_product";
import {_old_cart} from "../models/ownmodel/_old_cart";
import {Request, Response} from "express";

const getProducts = (req: Request, res: Response) => {
    _old_product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

const getProduct = (req: Request, res: Response) => {
    const prodId = req.params.productId;
    _old_product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
};

const getIndex = (req: Request, res: Response) => {
    _old_product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

const getCart = (req: Request, res: Response) => {
    _old_cart.getCart(cart => {
        _old_product.fetchAll(products => {
            const cartProducts = [];
            // @ts-ignore
            for (product of products) {
                const cartProductData = cart.products.find(
                    // @ts-ignore
                    (prod: any) => prod.id === product.id
                );
                if (cartProductData) {
                    // @ts-ignore
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

const postCart = (req: Request, res: Response) => {
    const prodId = req.body.productId;
    _old_product.findById(prodId, product => {
        _old_cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

const postCartDeleteProduct = (req: Request, res: Response) => {
    const prodId = req.body.productId;
    _old_product.findById(prodId, product => {
        _old_cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

const getOrders = (req: Request, res: Response) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

const getCheckout = (req: Request, res: Response) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

export {getCheckout, getIndex, getOrders, postCartDeleteProduct, getProduct, postCart, getProducts, getCart}