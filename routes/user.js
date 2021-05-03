const router = require('express').Router();
const Sequelize = require('sequelize');
const User = require('../models/user');
const { passport, requireLogin } = require('../auth');

router.get('/', requireLogin, (req, res) => {
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
            ...whereClause
        })
        .then(users => {
            users = users.map(user => user.dataValues);
            res.render('home', { users: users, user: req.user.dataValues })
        });

})

router.get('/register', (req, res) => {
    return res.render('register', { errors: [] });
});
router.post('/register', (req, res) => {
    let errors = [];
    let email = req.body.email;
    let password = req.body.password;
    return User.findOne({ where: { email: email } }).then((user) => {
        if (user) {
            errors.push({ message: "Email already exists" });
            return res.render('register', { errors: errors });
        } else {
            return User.create({ email: email, pswd: password }).then(user => {
                    return res.redirect('/');
                })
                .catch((error) => {
                    errors.push({ message: error });
                    console.log(errors)
                    return res.render('register', { errors: errors });
                })
        }
    });
});

router.get('/login', (req, res) => {
    return res.render('login')
})
router.post("/login", (req, res, next) => {
    return passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: false,
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });

});










module.exports = router;