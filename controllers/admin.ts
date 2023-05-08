import {Product} from "../models/product";
import e from "express";

const getAddProduct = (req: any, res: any) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

const postAddProduct = (req: any, res: any) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({title, imageUrl, price, description})

};

const getEditProduct = (req: any, res: any) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

};

const postEditProduct = (req: any, res: any) => {

    res.redirect('/admin/products');
};

const getProducts = (req: any, res: any) => {

};

const postDeleteProduct = (req: any, res: any) => {
    const prodId = req.body.productId;
    res.redirect('/admin/products');
};

export {getProducts, getAddProduct, postAddProduct, postDeleteProduct, postEditProduct, getEditProduct}