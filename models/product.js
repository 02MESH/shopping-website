const getDb = require('../util/database').getDb;
const mongodb = require('mongodb').ObjectId;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
        .then(array => {
            return array;
        })
        .catch(err => console.log(err));
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products')
        .find({_id: new mongodb(id)})
        .next()
        .then(product => {
            return product;
        })
        .catch(err => console.log(err));
    }
}

module.exports = Product;