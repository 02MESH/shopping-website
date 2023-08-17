const Product = require('../models/product');

const getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: "Add-Products",
        path: '/admin/add-product',
        editing: false
    });
}

const getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const productId = req.params.productId;
    Product.getProductById(productId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: "Edit-Product",
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

const getPostEditProducts = (req, res, next) => {
    const updatedId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedProduct = new Product(updatedId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
    console.log(updatedId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
    updatedProduct.save();
    res.redirect("/admin/products");
};

const postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageUrl, price, description);
    console.log(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/");
}

const getProducts = (req, res, next) => {
    Product.fetchAll(products => { //will execute the following code once its finished
        res.render('admin/products', {
            prods: products,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
}

//middleware function that will delete the product
const deleteProducts = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products');
}

module.exports = {
    AddProduct: getAddProducts,
    PostProduct: postAddProducts,
    GetProduct: getProducts,
    EditProduct: getEditProducts,
    PostEditProduct: getPostEditProducts,
    DeleteProduct: deleteProducts
}