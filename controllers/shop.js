const Product = require('../models/product');

const getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
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
    Product.fetchAll().then(products => {
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
    const productId = req.params.productId;
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
    req.user.getCart()
        .then(cart => {
            return cart.getProducts().then(products => {
                res.render('shop/cart', {
                    docTitle: 'Your Cart',
                    path: '/cart',
                    //Return the products array and render it
                    products: products
                });
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        });
};

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err);
        })
}

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
};

const deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        }).then(products => {
            const product = products[0];
            product.cartItem.destroy();
        }).then(result => {
            res.redirect('/cart');
        }).catch(err => console.log(err));
}

const postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

const getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
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
    GetCheckout: getCheckout,
    GetOrder: getOrders,
    GetProduct: getProduct,
    PostCart: postCart,
    DeleteCartItem: deleteCartItem,
    PostOrder: postOrder
}