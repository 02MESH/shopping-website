const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const path = require('path');

//Models here
const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("64f7841c6d290a5716c96acb")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.error);

mongoose.connect('mongodb+srv://meshwildias:UMzqsmCwSMFWYbNV@shopping-website-mongoo.d5au7rn.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Joshua',
                    email: 'joshuadias2005@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            };
        })
        app.listen(3000);
    })
    .catch(err => console.log(err));