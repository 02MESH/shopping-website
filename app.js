const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const app = express();
const path = require('path');

//Models here
const User = require('./models/user');

const errorController = require('./controllers/error');
const MongoConnect = require('./util/database').mongoConnect;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

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

app.use("/admin", adminRoutes); 
app.use(shopRoutes);

app.use(errorController.error);

MongoConnect(() => {
    app.listen(3000);
})