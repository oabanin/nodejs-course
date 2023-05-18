import {Product} from "../models/product";

const getProducts = (req: any, res: any) => {
    Product.fetchAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(console.log)
};

const getProduct = async (req: any, res: any) => {
    const prodId = req.params.productId;
    const product: any = await Product.findById(prodId);
    res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
    });
}
const getIndex = (req: any, res: any) => {
    Product.fetchAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(console.log)
};

const getCart = async (req: any, res: any) => {
    const products = await req.user.getCart();
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
    });

};

const postCart = async (req: any, res: any) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        });
};

const postCartDeleteProduct = async (req: any, res: any) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then((result:any) => {
            res.redirect('/cart');
        })
        .catch((err:any) => console.log(err));
};

const postOrder = async (req: any, res: any) => {
    // const cart = await req.user.getCart();
    // const products = await cart.getProducts();
    // const order = await req.user.createOrder();
    // const orderWithProducts = order.addProducts(products.map((product: any) => ({...product, orderItem: {quantity: product.cartItem.quantity}})))
    // res.redirect('/orders');
};

const getOrders = (req: any, res: any) => {
    // const orders =  req.user.getOrders();
    // res.render('shop/orders', {
    //     path: '/orders',
    //     pageTitle: 'Your Orders',
    //     orders,
    // });
};

const getCheckout = (req: any, res: any) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

export {getCheckout, getProducts, getProduct, postCartDeleteProduct, postCart, getCart, getOrders, getIndex, postOrder}