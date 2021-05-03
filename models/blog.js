const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./user')

class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    blog_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {

    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'blog',


});

// Blog.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Blog;