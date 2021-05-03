const router = require('express').Router();
const Sequelize = require('sequelize');
const Blog = require('../models/blog');
const { requireLogin } = require('../auth');
const User = require('../models/user');


router.post('/blogs', requireLogin, (req, res) => {
    let errors = [];
    let blog_title = req.body.blog_title;
    let content = req.body.content;
    return Blog.findOne({ where: { blog_title: blog_title } }).then((blog) => {

        if (blog) {
            errors.push({ message: "blog already exists" });
            return res.render('/', { errors: errors });

        } else {
            return Blog.create({
                    blog_title: blog_title,
                    content: content,
                    user_id: req.user.dataValues.id
                })
                .then(blog => {
                    return res.redirect('blogs');
                })
                .catch((error) => {
                    errors.push({ message: error });
                    console.log(errors)
                    return res.render('blogs', { errors: errors });
                })
        }
    });
})

router.get('/blogs', requireLogin, (req, res) => {
    let limit = 100;
    if (req.query.limit != undefined) {
        limit = parseInt(req.query.limit);
    }
    let whereClause = {};
    if (req.query.search != undefined) {
        whereClause = {
            where: {
                blog_title: {
                    [Sequelize.Op.like]: '%' + req.query.search + '%'
                },
                content: {
                    [Sequelize.Op.like]: '%' + req.query.search + '%'

                }
            }
        }
    }
    return Blog.findAll({
            limit: limit,
            ...whereClause
        })
        .then(blogs => {
            blogs = blogs.map(blog => blog.dataValues);
            res.render('blogs', { blogs: blogs })
        });
})

module.exports = router;