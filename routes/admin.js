const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.js');

router.get('/add-product', adminController.AddProduct);

router.get('/edit-product/:productId', adminController.EditProduct);

router.post('/edit-product', adminController.PostEditProduct);

// // //send this request to the deleteProduct middleware
router.post('/delete-product', adminController.DeleteProduct);

router.get('/products', adminController.GetProduct);

router.post('/add-product', adminController.PostProduct);

module.exports = router;