import {Sequelize} from "sequelize"
import {Product} from "../../models/mongodb/product";

const sequelize = new Sequelize('nodejs-complete', 'root', '12345678', {
    dialect: 'mysql',
    host: 'localhost'
});
// Product.sync();



export {sequelize}
