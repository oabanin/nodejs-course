import {INTEGER} from "sequelize"
import {sequelize} from "../util/database";
import {type} from "os";

const Cart = sequelize.define('cart', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

export {Cart}