import * as fs from "fs";
import path from "path";

const p = path.join(
    path.dirname(require.main?.filename as string),
    'data',
    'cart.json'
);

export class Cart {
  static addProduct(id:string, productPrice:number) {
    // @ts-ignore
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        // @ts-ignore
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
          // @ts-ignore
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        // @ts-ignore
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        // @ts-ignore
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        // @ts-ignore
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      // @ts-ignore
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id:string, productPrice:number) {
    fs.readFile(p, (err:any, fileContent:any) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      // @ts-ignore
      const product = updatedCart.products.find(prod => prod.id === id);
      if (!product) {
          return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
          // @ts-ignore
        prod => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      // @ts-ignore
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb:any) {
    fs.readFile(p, (err:any, fileContent:any) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
