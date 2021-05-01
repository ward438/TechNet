const router = require('express').Router();
const Sequelize = require('sequelize');
const User = require('../../models/user');



router.get('/', (req, res) => {
    // to use add ?search= to address
    let limit = 100;
    if (req.query.limit != undefined) {
        limit = parseInt(req.query.limit);
    }
    let whereClause = {};
    if (req.query.search != undefined) {
        whereClause = {
            where: {
                email: {
                    [Sequelize.Op.like]: '%' + req.query.search + '%'
                }
            }
        }
    }

    return User.findAll({
            limit: limit,
            whereClause
        })
        .then(users => {
            users = users.map(user => user.dataValues);
            res.render('home', { users: users })
        });
})


module.exports = router;