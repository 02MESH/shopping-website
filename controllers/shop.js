const Product = require('../models/product');
const mongoose = require('mongoose');

const getProducts = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => {
        console.log(err);
    });
}

const getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
    }).catch(err => {
        console.log(err);
    });
};

const getProduct = (req, res, next) => {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    Product.findById(productId).then(product => {
        res.render('shop/product-detail', {
            product: product,
            docTitle: product.title,
            path: "/products"
        });
    }).catch(err => {
        console.log(err);
    })
};

const getCart = (req, res, next) => {
    //Get the cart
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                //Return the products array and render it
                products: products
            });
        }).catch(err => {
            console.log(err);
        });
};

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            //js treats this as a string but not really
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart')
        })
}

const deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        }).catch(err => console.log(err));
}

const postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

const getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                docTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}

module.exports = {
    GetProducts: getProducts,
    GetIndex: getIndex,
    GetCart: getCart,
    GetOrder: getOrders,
    GetProduct: getProduct,
    PostCart: postCart,
    DeleteCartItem: deleteCartItem,
    PostOrder: postOrder
}