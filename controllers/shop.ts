import {Product} from "../models/product";
import {Order} from "../models/order";
import fs from 'fs'
import path from "path";
import PDFDocument from "pdfkit";

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_BACKEND_KEY ||'', { apiVersion: '2022-11-15',});


const ITEMS_PER_PAGE = 1;

const getProducts = async (req: any, res: any) => {
    const page = +req.query.page || 1;

    const totalItems = await Product.find().countDocuments()


    Product.find({userId: req.user._id})
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(products => {
            // console.log(products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                totalProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err);
        });
};

const getProduct = async (req: any, res: any) => {
    const prodId = req.params.productId;
    const product: any = await Product.findById(prodId);
    res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
    });
}
const getIndex = async (req: any, res: any) => {
    const page = +req.query.page || 1;

    const totalItems = await Product.find().countDocuments()

    Product
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                totalProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                // isAuthenticated:req.session.isLoggedIn,
                // csrfToken: req.csrfToken()
            });
        }).catch(console.log)
};

const getCart = async (req: any, res: any) => {
    req.user
        .populate('cart.items.productId')
        .then((user: any) => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
            });
        })
        .catch((err: any) => console.log(err));

};

const postCart = async (req: any, res: any) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        }).catch((e) => console.log(e))
};

const postCartDeleteProduct = async (req: any, res: any) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then((result: any) => {
            res.redirect('/cart');
        })
        .catch(console.log);
};

const postOrder = async (req: any, res: any) => {

    const user = await req.user.populate('cart.items.productId');
    const products = user.cart.items.map((i: any) => ({quantity: i.quantity, product: {...i.productId._doc}}));
    const order = new Order({
        user: {
            email: req.user.email,
            userId: req.user,
        },
        products
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');

};

const getOrders = async (req: any, res: any) => {
    const orders = await Order.find({"user.userId": req.user._id})
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
    });

};

const getCheckout = (req: any, res: any, next: any) => {
    let products: any;
    let total = 0;
    req.user
        .populate('cart.items.productId')
        .then((user: any) => {
            products = user.cart.items;
            total = 0;
            products.forEach((p: any) => {
                total += p.quantity * p.productId.price;
            });

            // return stripe.checkout.sessions.create({
            //     payment_method_types: ['card'],
            //     line_items: products.map((p: any) => {
            //         return {
            //             name: p.productId.title,
            //             description: p.productId.description,
            //             amount: p.productId.price * 100,
            //             currency: 'usd',
            //             quantity: p.quantity
            //         };
            //     }),
            //     success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
            //     cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            // });
        })
        // .then((session: any) => {
        //     res.render('shop/checkout', {
        //         path: '/checkout',
        //         pageTitle: 'Checkout',
        //         products: products,
        //         totalSum: total,
        //         sessionId: session.id
        //     });
        // })
        .catch((err: any) => {
            const error: any = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

const getCheckoutSuccess = (req: any, res: any, next: any) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user: any) => {
            const products = user.cart.items.map((i: any) => {
                return {quantity: i.quantity, product: {...i.productId._doc}};
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then((result: any) => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch((err: any) => {
            const error: any = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

const getInvoice = async (req: any, res: any, next: any) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new Error("No order found"));
    }
    if (order?.user?.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(`Content-Disposition`, `attachment; filename="${invoiceName}"`); // download
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc
        .fontSize(26)
        .text('Invoice', {underline: true})
        .text('-------------');
    let totalPrice = 0;
    order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + "$" + prod.product.price);
    })

    pdfDoc.fontSize(20).text('TOtal price: ' + totalPrice)

    pdfDoc.end();

    // can be overflowed if big file
    // fs.readFile(invoicePath, (err, data) => {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.setHeader('Content-Type', 'application/pdf');
    //     // res.setHeader(`Content-Disposition`, `inline`); // show
    //     // res.setHeader(`Content-Disposition`, `inline; filename="${invoiceName}"`); // show with proper name
    //     res.setHeader(`Content-Disposition`, `attachment; filename="${invoiceName}"`); // download
    //     res.send(data);
    // })

    //For pre generated

    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader(`Content-Disposition`, `attachment; filename="${invoiceName}"`); // download
    // file.pipe(res); //
};

export {
    getCheckout,
    getProducts,
    getProduct,
    postCartDeleteProduct,
    postCart,
    getCart,
    getOrders,
    getIndex,
    postOrder,
    getInvoice,
    getCheckoutSuccess
}