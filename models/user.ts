import {Schema, model} from "mongoose";
import {ObjectId} from "mongodb";
import {getDb} from "../util/database";


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
                quantity: {
                    type: Number, required: true
                }
            }]
    }
});

userSchema.methods.addToCart = function(product:any) {
    const cartProductIndex = this.cart.items.findIndex((cp:any) => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

const User = model('User', userSchema);
export {User}