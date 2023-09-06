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
    Product.findById(productId)
        .then(product => {
            res.render('admin/edit-product', {
                docTitle: "Edit-Product",
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/');
        });
};

const getPostEditProducts = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    Product.findById(productId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log('Product updated!');
            res.redirect("/admin/products");
        }).catch(err => {
            console.log(err);
        })
};

const postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
}

const getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                docTitle: 'Admin Products',
                path: '/admin/products'
            });
        }).catch(err => console.log(err));
}

//middleware function that will delete the product
const deleteProducts = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(() => {
            console.log('Product Deleted!');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        })
}

module.exports = {
    AddProduct: getAddProducts,
    PostProduct: postAddProducts,
    GetProduct: getProducts,
    EditProduct: getEditProducts,
    PostEditProduct: getPostEditProducts,
    DeleteProduct: deleteProducts
}