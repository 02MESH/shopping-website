exports.error = (req,res,next) => {
    res.status(404).render('404', {docTitle: 'Error 404', path: ''});
}