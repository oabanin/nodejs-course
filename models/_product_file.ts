import * as fs from "fs";
import path from "path";

const p = path.join(path.dirname(require.main?.filename as string), 'data', 'products.json');
import {Cart} from "./cart";

const getProductsFromFile = (cb: (products: any) => void) => {
    fs.readFile(p, (err, fileContent: any) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

export class Product {
    id: string | null;
    title: string;
    imageUrl: string;
    description: string;
    price: string;

    constructor(id: string | null, title: string, imageUrl: string, description: string, price: string) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    (prod: any) => prod.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id: string) {
        getProductsFromFile(products => {
            const product = products.find((prod: any) => prod.id === id);
            const updatedProducts = products.filter((prod: any) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb: (products: any) => void) {
        getProductsFromFile(cb);
    }

    static findById(id: string, cb: (products: any) => void) {
        getProductsFromFile(products => {
            const product = products.find((p: any) => p.id === id);
            cb(product);
        });
    }
};