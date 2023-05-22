import {getDb} from "../../util/database";
import {ObjectId} from "mongodb";

class Product {
    title: string;
    price: string;
    description: string;
    imageUrl: string;
    _id?: ObjectId;

    constructor(title: string, price: string, description: string, imageUrl: string, id?: string, userId?:string) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ?  new ObjectId(id) : undefined;
    }

    async save() {
        const db = getDb();
        if (this._id) {
            return await db.collection('products').updateOne({_id: this._id}, {$set: this})
        } else {
            return await db.collection('products').insertOne(this)
        }
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
        //toArray should be used only if the quantity is not more than 1000
    }

    static findById(id: string) {
        const db = getDb();
        return db.collection('products').find({_id: new ObjectId(id)}).next();
    }

    static deleteById(id: string) {
        const db = getDb();
        return db.collection('products').deleteOne( {_id: new ObjectId(id)});
        //toArray should be used only if the quantity is not more than 1000
    }
}

export {Product}