const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');
const app = express();
const path = require('path');

//Models here
const User = require('./models/user');

const errorController = require('./controllers/error');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("64ecc58dfed9abcb67e4487c")
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
})

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);
//UMzqsmCwSMFWYbNV
app.use(errorController.error);

mongoose.connect('mongodb+srv://meshwildias:UMzqsmCwSMFWYbNV@shopping-website-mongoo.d5au7rn.mongodb.net/?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.log(err));