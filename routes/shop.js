const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.GetIndex);

router.get('/products', shopController.GetProducts);

router.get('/products/:productId', shopController.GetProduct);

router.post('/cart', shopController.PostCart);

router.post('/delete-cart-item', shopController.DeleteCartItem);

router.get('/cart', shopController.GetCart);

router.post('/create-order', shopController.PostOrder);

router.get('/orders', shopController.GetOrder);

module.exports = router;