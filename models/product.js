const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../', 'data', 'products.json');
const Cart = require('./cart.js');

//cleaner code
const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                //again, don't need this but just putting it
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        })
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if(!err) {
                    //Remove items from cart now
                    Cart.delete(id, product.price);
                }
            })
        })
    }

    static fetchAll(cb) { //cb is the products array that is being passed and is automatically filled
        getProductsFromFile(cb);
    }

    //Getting the object that relates to a specific id
    static getProductById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};