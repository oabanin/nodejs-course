import {Db, MongoClient} from "mongodb";
import {MONGODB_URI} from "../app";

let _db:Db;

const mongoConnect = async (callback:any) => {
 //   const client = await MongoClient.connect('mongodb+srv://juristoleh:We7pl3E18bUFzya@cluster0.srse5oy.mongodb.net/shop?retryWrites=true&w=majority');
    const client = await MongoClient.connect(MONGODB_URI);

    _db = client.db('shop'); //db can be reviewted
    callback(client);
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw "err";
}

export {mongoConnect, getDb };