const Product = require('../models/product');
const Order = require('../models/order');

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

const getCart = async (req, res, next) => {
    //Get the cart
    await req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
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
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart')
        });
};

const deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        }).catch(err => console.log(err));
}

const postOrder = async (req, res, next) => {
    await req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

const getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                docTitle: 'Orders',
                path: '/orders',
                orders: orders
            })
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