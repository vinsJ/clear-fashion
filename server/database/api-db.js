const db = require('./index')

const getProductID = async function(id){
    let res = await db.getQuery({uuid: id}, null, 'find');
    return res;
}

module.exports.getProductID = getProductID;