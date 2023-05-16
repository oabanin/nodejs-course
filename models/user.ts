import {getDb} from "../util/database";
import {ObjectId} from "mongodb";

class User {
    email: string;
    name: string;

    constructor(username: string, email: string) {
        this.name = username;
        this.email = email;
    }

    async save() {
        const db = getDb();
        return await db.collection('users').insertOne(this)
    }

    static async findById(userId: string) {
        const db = getDb();
        return await db.collection('users')
            .find({_id: new ObjectId(userId)})
             .next();
    }
}

export {User}