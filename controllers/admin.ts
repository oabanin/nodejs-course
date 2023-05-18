import {Product} from "../models/product";
import e from "express";
import {Model} from "sequelize";
import {ObjectId} from "mongodb";

const getAddProduct = (req: any, res: any) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

const postAddProduct = async (req: any, res: any) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, undefined, req.user.id)
    const result = await product.save();
    return result;

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
            product: product
        });
    }).catch(console.log)


};

const postEditProduct = async (req: any, res: any) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = await Product.findById(prodId);
    const newProduct = new Product(updatedTitle, updatedPrice,updatedDesc,updatedImageUrl ,prodId);
    await newProduct.save()
    res.redirect('/admin/products');
};
//
const getProducts = (req: any, res: any) => {
    Product.fetchAll().then((products: any) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(console.log)


};

const postDeleteProduct = async (req: any, res: any) => {
    const prodId = req.body.productId;
    const product = await Product.deleteById(prodId);
    res.redirect('/admin/products');
};

export {getProducts, getAddProduct, postAddProduct, postDeleteProduct, postEditProduct, getEditProduct}