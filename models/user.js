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
        beforeCreate: (user) => bcrypt.hash(user.pswd, 10)
            .then(hash => {
                user.pswd = hash;
            })
            .catch(err => {
                throw new Error(err);
            }),
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
});

User.prototype.validPassword = (password, pswd) => {
    return bcrypt.compare(password, pswd);
}
module.exports = User;