const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const app = express();
const path = require('path');

const errorController = require('./controllers/error');

///const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

const MongoConnect = require('./util/database').mongoConnect;

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//app.use("/admin", adminRoutes); 
// app.use(shopRoutes);

app.use(errorController.error);

MongoConnect(client => {
    console.log(client);
    app.listen(3000);
})