const db = require('./index')

const getProductID = async function(id){
    let res = await db.getQuery({uuid: id}, null, 'find');
    return res;
}

const getProducts = async function(filter) {
    let query = "";
    if(!filter.brand) {
        if(filter.price < 0){
            query = {price : {$lt: (filter.price*-1)}};
        } else if (filter.price > 0){
            query = {price : {$gt: filter.price}};
        } else {
            query = {}
        }
    } else {
        if(filter.price < 0){
            query = {brandName : filter.brand, price : {$lt: (filter.price*-1)}};
        } else if (filter.price > 0){
            query = {brandName : filter.brand, price : {$gt: filter.price}};
        } else {
            query = {brandName : filter.brand};

        }
    }

    console.log("Looking for products matching: " + JSON.stringify(query) + " ... 🕵️‍♀️");
    let res = await db.getQuery(query, true, 'API', filter.limit);
    return res;
}

module.exports.getProductID = getProductID;
module.exports.getProducts = getProducts;