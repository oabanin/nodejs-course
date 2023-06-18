import {Product} from "../models/product";
import {validationResult} from "express-validator";

import {Types} from "mongoose";

import {deleteFile} from "../util/file";

const getAddProduct = (req: any, res: any) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

const postAddProduct = async (req: any, res: any, next: any) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title,
                price,
                description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        });
    }

    const imageUrl = image.path;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title,
                price,
                description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
//
    try {
        const product = new Product({
            // _id: new Types.ObjectId('648a19028146e1ad944ad977'),
            title,
            price,
            imageUrl,
            description,
            userId: req.user._id
        })
        await product.save();
    } catch (e) {
        // return  res.redirect('/500')

        // return res.status(500).render('admin/edit-product', {
        //     pageTitle: 'Add Product',
        //     path: '/admin/add-product',
        //     editing: false,
        //     hasError: true,
        //     product: {
        //         title,
        //         imageUrl,
        //         price,
        //         description
        //     },
        //     errorMessage: "DB failed",
        //     validationErrors: []
        // });
        const error: any = new Error(e as string);
        error.httpStatusCode = 500;
        return next(error);
    }

    res.redirect('/products');

};

const getEditProduct = (req: any, res: any) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId).then((product: any) => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            errorMessage: null,
            validationErrors: []
        });
    }).catch(console.log)


};

const postEditProduct = async (req: any, res: any) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const product = await Product.findById(prodId);
    if (product) {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        // console.log('update product');
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if (image) {
            deleteFile(product.imageUrl);
            product.imageUrl = image.path
        }

        await product.save()
    }
    res.redirect('/admin/products');
};
//
const getProducts = (req: any, res: any) => {
    Product
        .find()
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then((products: any) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        }).catch(console.log)


};

const deleteProduct = async (req: any, res: any, next: any) => {
    const prodId = req.params.productId;
    //await Product.findByIdAndRemove(prodId);
    //    const result = await Product.deleteOne({id: prodId, userId: req.user._id}); only yours

    const product = await Product.findById(prodId);
    if (!product) {
        return next(new Error('Product not found'))
    }
    deleteFile(product.imageUrl);

    await Product.deleteOne({_id: prodId});
    res.status(200).json({message: "Success"})
};

export {getProducts, getAddProduct, postAddProduct, deleteProduct, postEditProduct, getEditProduct}