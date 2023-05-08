import {_old_product} from "../models/_old_product";
import {Request, Response} from "express";

const getAddProduct = (req: Request, res: Response) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

const postAddProduct = (req: Request, res: Response) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new _old_product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

const getEditProduct = (req: Request, res: Response) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Product.findById(prodId, (product: any) => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit Product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     });
    // });
};

const postEditProduct = (req: Request, res: Response) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new _old_product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products');
};

const getProducts = (req: Request, res: Response) => {
    // Product.fetchAll(products => {
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle: 'Admin Products',
    //         path: '/admin/products'
    //     });
    // });
};

const postDeleteProduct = (req: Request, res: Response) => {
    const prodId = req.body.productId;
    _old_product.deleteById(prodId);
    res.redirect('/admin/products');
};

export {postDeleteProduct, postEditProduct, getEditProduct, postAddProduct, getProducts, getAddProduct}