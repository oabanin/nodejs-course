import {Product} from "../models/product";
import e from "express";
import {Model} from "sequelize";

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
    req.user.createProduct({title, imageUrl, price, description}) //CREATE new assossicated product
    //INSTEAD OF
    // Product.create({title, imageUrl, price, description,
    // userId:req.user.id
    // })

};

const getEditProduct = (req: any, res: any) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    //FOR 1 users
    // req.user.getProducts({where:{id:prodId}});
    //OR if for all users
    Product.findByPk(prodId).then((product: any) => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    }).catch(console.log);

};

const postEditProduct = async (req: any, res: any) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = await Product.findByPk<any>(prodId);
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    await product.save();

    res.redirect('/admin/products');
};

const getProducts = (req: any, res: any) => {
    //Product.findAll(). //If you do not take into account user
    req.user.getProducts()
        .then((products: any) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(console.log)
};

const postDeleteProduct = async (req: any, res: any) => {
    const prodId = req.body.productId;
    const product = await Product.findByPk<Model<any, any>>(prodId);
    await product?.destroy()
    res.redirect('/admin/products');
};

export {getProducts, getAddProduct, postAddProduct, postDeleteProduct, postEditProduct, getEditProduct}