import * as fs from "fs";
import path from "path";

const p = path.join(path.dirname(require.main?.filename as string), 'data', 'products.json');
import {_old_cart} from "./_old_cart";

import {db} from "../../util/_old_database";

export class _old_product {
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
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id: string) {
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id: string) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
};