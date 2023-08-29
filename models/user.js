const getDb = require('../util/database').getDb;
const mongoObject = require('mongodb').ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        let dbOperation;
        if (id) {
            dbOperation = db.collection('users')
                .updateOne({ _id: new mongoObject(this._id) }, { $set: this })
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
        const cartProductIndex = this.cart.items.findIndex(cp => {
            /*Since cp & product are reference types, they don't however, point to the same objects in the sense
              that both of them are not the same reference data so you need to convert it to string in order to get
              the correct result. */
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new mongoObject(product._id), quantity: newQuantity });
        }

        const updatedCart = { items: updatedCartItems };

        return db
            .collection('users')
            .updateOne({ _id: new mongoObject(this._id) },
                { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb();
        //Return all the productIds that the customer has selected and put it in an array.
        //Map retrieves all the productIds and puts it into the array productIds
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        //Returns specific products relating to the user along with its quantity.
        return db.collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                //Returns an array that maps the product objects by..
                return products.map(p => {
                    /*Returns a js object which returns all the products object with the product properties and 
                      an additional property i.e. quantity, which we need to find. Look below*/
                    return {
                        ...p, quantity: this.cart.items.find(item => {
                            /*Only returns the product back if the product id matches the productId from the
                              items array*/
                            return p._id.toString() === item.productId.toString();
                        }).quantity//This returns the quantity back resulting from that search
                    };
                })
            });
    }

    deleteItemFromCart(productId) {
        let updatedCart = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: new mongoObject(this._id) }, { $set: { cart: { items: updatedCart } } });
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongoObject(this._id),
                        name: this.name
                    }
                };
                return db.collection('orders').insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne({ _id: new mongoObject(this._id) },
                        { $set: { cart: { items: [] } } }
                    );
            });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
            .find({ 'user._id': new mongoObject(this._id) })
            .toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongoObject(id) })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;