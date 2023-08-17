const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../', 'data', 'cart.json');

module.exports = class cart {
    static addProduct(id, productPrice) {
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            /*cart is a key-value pair,
             *Is currently only for single user as the app is still being developed
             *cart is key-value pair which will be updated once new products will be added to the cart
             */
            let cart = {
                products: [],
                totalPrice: 0
            };
            /*JSON.parse(filcontent) parses the data from cart.json and saves it in the cart object where
             *the array of different products are saved in
             */
            if (!err) {
                cart = JSON.parse(fileContent);
            };
            //Analyse the cart => find existing product
            const existingProductIndex = cart.products.findIndex(product =>
                product.id === id
            );
            //Now retrieve the object with the same product ID if there is any
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //Add new product/ increase quantity
            if (existingProduct) {
                //Initialise a new object with the properties of existingProduct at that index
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;
                /*Get the products from the cart object and saves it back to cart.products,
                 *doesn't really makes sense and the code works without it.*/
                cart.products = [...cart.products];
                //Go to that index and update its content with updatedProduct
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                //Otherwise create a new object with the current id and a quantity of 1
                updatedProduct = { id: id, quantity: 1 };
                //Insert updatedProduct to the end of cart.products
                cart.products = [...cart.products, updatedProduct]; //next gen js array function
            }
            //"+productPrice" converts the string into an actual number
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static delete(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            let cart = {
                products: [],
                totalPrice: 0
            };
            cart = JSON.parse(fileContent);
            //A new array holding the content
            const updatedCart = { ...cart };
            //get the product from the updated array using the id
            const product = updatedCart.products.find(prod => prod.id === id);
            //Bug fix
            if(!product) {
                return;
            }
            //get the quantity of that product
            const productQuantity = product.quantity;
            //filter the updated cart and only use those products that are not matching that id
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            //set the price of that cart by subtracting the cost of the product multiplied by its quantity
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQuantity);
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};