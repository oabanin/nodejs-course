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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
    });

};

const postCart = async (req: any, res: any) => {
    // const prodId = req.body.productId;
    // const cart = await req.user.getCart();
    // const productInCart = await cart.getProducts({where: {id: prodId}})?.[0];
    // let newQuantity = 1;
    // const product = await Product.findByPk<any>(prodId);
    // if (product) {
    //     const oldQuantity = product.cartItem.quantity;
    //     newQuantity = oldQuantity + 1;
    //     cart.addProduct(product, {through: {quantity: newQuantity}})
    // } else {
    //     cart.addProduct(product, {through: {quantity: newQuantity}})
    // }
    //
    // res.redirect('/cart')
};

const postCartDeleteProduct = async (req: any, res: any) => {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({where: {id: prodId}})
    const product = products[0];
    res.redirect('/cart');
    return await product.cartItem.destroy()
};

const postOrder = async (req: any, res: any) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    const orderWithProducts = order.addProducts(products.map((product: any) => ({...product, orderItem: {quantity: product.cartItem.quantity}})))
    res.redirect('/orders');
};

const getOrders = (req: any, res: any) => {
    const orders =  req.user.getOrders();
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
    });
};

const getCheckout = (req: any, res: any) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

export {getCheckout, getProducts, getProduct, postCartDeleteProduct, postCart, getCart, getOrders, getIndex, postOrder}