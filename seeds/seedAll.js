const sequelize = require('../config/connection');

const User = require('../models/user');
const userData = require('./userData.json');

const Blog = require('../models/blog');
const blogData = require('./blogData.json');

const seedDatabase = () => {
    return sequelize.sync({ force: true })
        .then(() => User.bulkCreate(userData, {
            individualHooks: true,
            returning: true,
        }))
        .then(() => Blog.bulkCreate(blogData, {
            individualHooks: true,
            returning: true,
        }))
        .then(() => {
            console.log('Seeded');
            process.exit(0);
        });
};

seedDatabase();