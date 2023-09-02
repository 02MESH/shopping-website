// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb').ObjectId;

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb(id) : null; 
//         /*If the id is not null, it will be saved as a mongodb id object instead of a string*/
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOperation;
//         if (this._id) {
//             dbOperation = db.collection('products')
//                 .updateOne({ _id: this._id }, { $set: this });
//         } else {
//             dbOperation = db.collection('products')
//                 .insertOne(this);
//         }
//         return dbOperation
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//             .then(array => {
//                 return array;
//             })
//             .catch(err => console.log(err));
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection('products')
//             .find({ _id: new mongodb(id) })
//             .next()
//             .then(product => {
//                 return product;
//             })
//             .catch(err => console.log(err));
//     }

//     static deleteById(id) {
//         const db = getDb();
//         return db.collection('products')
//             .deleteOne({ _id: new mongodb(id) })
//             .then(() => {
//                 console.log('Deleted product');
//             })
//             .catch(err => console.log(err));
//     }
// }

// module.exports = Product;