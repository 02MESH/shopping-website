const Product = require('../models/product');
const Cart = require('../models/cart');

const getProducts = (req, res, next) => {
    Product.fetchAll(products => { //will execute the following code once its finished
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'All Products',
            path: '/products'
        });
        //Will not asynchronously execute it here
    });
}

const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.getProductById(productId, product => {
        res.render('shop/product-detail', {
            product: product,
            docTitle: product.title,
            path: "/products"
        });
    });
};

const getIndex = (req, res, next) => {
    Product.fetchAll(products => { //will execute the following code once its finished
        res.render('shop/index', {
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
        //Will not asynchronously execute it here
    });
};

const getCart = (req, res, next) => {
    //Get the cart
    Cart.getCart(cart => {
        //Get the products from to check if it is in stock
        Product.fetchAll(products => {
            //Constructing a new array of key-value pairs of the product and its quantity
            const cartProducts = [];
            for (product of products) {
                //Check whether if the cart item is in the cart or is out of stock?
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                //If in stock, then pushit in the cartProductData array
                if (cartProductData) {
                    cartProducts.push({ productData: product, quantity: cartProductData.quantity });
                }
            }
            res.render('shop/cart', {
                docTitle: 'Carts',
                path: '/cart',
                //Return the products array and render it
                products: cartProducts
            });
        });
    });
};

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.getProductById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
}

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
};

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders'
    });
}

const deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    Product.getProductById(productId, product => {
        Cart.delete(productId, product.price);
        res.redirect('/cart');
    });
}

module.exports = {
    GetProducts: getProducts,
    GetIndex: getIndex,
    GetCart: getCart,
    GetCheckout: getCheckout,
    GetOrder: getOrders,
    GetProduct: getProduct,
    PostCart: postCart,
    DeleteCartItem: deleteCartItem
}