import * as fs from "fs";
import path from "path";

const p = path.join(
    path.dirname(require.main?.filename as string),
    'data',
    'cart.json'
);

export class Cart {
    static addProduct(id: string, productPrice: number) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent: any) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(
                (prod: any) => prod.id === id
            );
            const existingProduct:any = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product/ increase quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                (cart.products as any)[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                // @ts-ignore
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id: string, productPrice: number) {
        fs.readFile(p, (err, fileContent: any) => {
            if (err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find((prod: any) => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                (prod: any) => prod.id !== id
            );
            updatedCart.totalPrice =
                updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb: (products: any) => void) {
        fs.readFile(p, (err, fileContent: any) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};
