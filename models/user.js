const getDb = require('../util/database').getDb;
const mongoObject = require('mongodb').ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id; //? new mongoObject(id) : null;
    }

    save() {
        const db = getDb();
        let dbOperation;
        if (id) {
            dbOperation = db.collection('users')
                .updateOne({_id: new mongoObject(this._id)}, {$set: this})
        } else {
            dbOperation = db.collection('users')
                .insertOne(this);
        }
        return dbOperation
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }

    addToCart(product) {
        const db = getDb();
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product._id;
        // })
        const updatedCart = {items: [{productId: new mongoObject(product._id), quantity: 1}]};
        return db
            .collection('users')
            .updateOne({_id: new mongoObject(this._id)}, 
            {$set: {cart: updatedCart}});
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({_id: new mongoObject(id)})
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;