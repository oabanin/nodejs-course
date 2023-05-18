import {getDb} from "../util/database";
import {ObjectId} from "mongodb";

class User {
    email: string;
    name: string;
    cart: any;
    _id: any;

    constructor(username: string, email: string, cart: any, id: string) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    async save() {
        const db = getDb();
        return await db.collection('users').insertOne(this)
    }

    addToCart(product: any) {
            const cartProductIndex = this.cart?.items.findIndex((cp: any) => {
                return cp.productId.toString() === product._id.toString()
            });

        let newQuantity = 1;
        const updatedCartItems = this.cart  ? [...this.cart.items] : [];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity})
        }
        const db = getDb();
        const updatedCart = {items: updatedCartItems}
        db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
    }

    async getCart() {
        const db = getDb();
        const productIds = this.cart.items.map((i: any) => {
            return i.productId;
        });

        return db
            .collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((i:any)=> {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId:string) {
        const updatedCartItems = this.cart.items.filter((item:any) => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: {items: updatedCartItems} } }
            );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name
                    }
                };
                return db.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    );
            });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': new ObjectId(this._id) })
            .toArray();
    }

    static async findById(userId: string) {
        const db = getDb();
        return await db.collection('users')
            .find({_id: new ObjectId(userId)})
            .next();
    }
}

export {User}