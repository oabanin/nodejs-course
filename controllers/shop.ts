import {Product} from "../models/product";
import {Cart} from "../models/cart";
import {_old_product} from "../models/ownmodel/_old_product";

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
    Product.findAll({
        where: {
            id: prodId
        }
    }).then((products: any[]) => {
        res.render('shop/product-detail', {
            product: products[0],
            pageTitle: products[0].title,
            path: '/products'
        });
    }).catch(console.log)
    // Product.findByPk(prodId).then((product: any) => {
    //     res.render('shop/product-detail', {
    //         product: product,
    //         pageTitle: product.title,
    //         path: '/products'
    //     });
    // });
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