const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');


class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.pswd);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    pswd: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [8],
        },
    },
}, {
    hooks: {
        beforeCreate: async(newUserData) => {
            newUserData.password = await bcrypt.hash(newUserData.pswd, 10);
            return newUserData;
        },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
});

module.exports = User;