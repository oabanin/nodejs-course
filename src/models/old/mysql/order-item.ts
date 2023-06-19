import {INTEGER, STRING, DOUBLE} from "sequelize"
import {sequelize} from "../util/database";
import {type} from "os";

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: INTEGER
})
export {OrderItem}