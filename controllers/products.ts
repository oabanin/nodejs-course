import {Request, Response} from "express";
const products:any[] = [];

const getAddProduct = (req: Request<{}, any, any, any>, res: Response<any, any> ) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
}

const postAddProduct = (req: Request<{}, any, any, any>, res: Response<any, any> ) => {
    products.push({ title: req.body.title });
    res.redirect('/');
}

const getProducts = (req: Request<{}, any, any, any>, res: Response<any, any> ) => {
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
}

export {getAddProduct, postAddProduct, getProducts}