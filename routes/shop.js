const express = require('express');
const router = express.Router();
const path = require('path');
const shopController = require('../controllers/shop');

router.get('/', shopController.GetIndex);

router.get('/products', shopController.GetProducts);

// router.post('/delete-cart-item', shopController.DeleteCartItem);

// //Handling specific product page
router.get('/products/:productId', shopController.GetProduct);

// //Loading the cart page
// router.get('/cart', shopController.GetCart);

// router.post('/create-order', shopController.PostOrder);

// //getting the post request after you add an item to the cart
// router.post('/cart', shopController.PostCart);

// router.get('/orders', shopController.GetOrder);

// router.get('/checkout', shopController.GetCheckout);

module.exports = router;