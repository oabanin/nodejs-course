import {Product} from "../models/product";

const getAddProduct = (req: any, res: any) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

const postAddProduct = async (req: any, res: any) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({title, imageUrl, price, description, userId: req.user._id})
    await product.save();
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
            isAuthenticated: req.session.isLoggedIn
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
    if (product) {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl
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
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            });
        }).catch(console.log)


};

const postDeleteProduct = async (req: any, res: any) => {
    const prodId = req.body.productId;
    await Product.findByIdAndRemove(prodId);
    res.redirect('/admin/products');
};

export {getProducts, getAddProduct, postAddProduct, postDeleteProduct, postEditProduct, getEditProduct}