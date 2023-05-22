import {INTEGER} from "sequelize"
import {sequelize} from "../../util/database";
import {type} from "os";

const Order = sequelize.define('order', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

export {Order }