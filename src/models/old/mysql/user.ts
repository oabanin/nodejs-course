import {INTEGER, STRING} from "sequelize"
import {sequelize} from "../util/database";

const User = sequelize.define('user', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:STRING,
    email: STRING
});

export {User}