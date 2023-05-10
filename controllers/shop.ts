import {Product} from "../models/product";

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

const getCart = async (req: any, res: any) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
    });

};

const postCart = async (req: any, res: any) => {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const productInCart = await cart.getProducts({where: {id: prodId}})?.[0];
    const newQuantity = 1;
    const product = await Product.findByPk(prodId);
    cart.addProduct(product, {through: {quantity: newQuantity}})

    res.redirect('/cart')
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