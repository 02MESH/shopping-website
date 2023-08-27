const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://meshwildias:RqLjRgMOGfrTJ61O@cluster1.4f9aqko.mongodb.net/?retryWrites=true&w=majority')
        .then(result => {
            console.log('Connected');
            _db = client.db;
            callback();
        })
        .catch(err => console.log(err));
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found';
}

module.exports = {
    mongoConnect: mongoConnect,
    getDb: getDb
};