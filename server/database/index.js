creds = require('./creds.json')

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://' + creds.user + ':' + creds.password + '@' + creds.cluster_url + '?retryWrites=true&w=majority'
const MONGODB_DB_NAME = 'clear-fashion';

const client = new MongoClient(MONGODB_URI,  {'useUnifiedTopology': true});

async function connect(){

    await client.connect();
    const db =  client.db(MONGODB_DB_NAME)

    return {client, db};
}

async function close(client){
    try{
        await client.close();
    } catch(e) {
        console.log(e);
    }

}

async function agg(db, query){
    try {
        const collection = db.collection('products');
        const res = await collection.aggregate(query, { "allowDiskUse" : true }).toArray();
        return res;
    } catch(e) {
        console.log(e)
    }
}

async function query(db, query, sort = null) {
    try{
        const collection = db.collection('products');
        let res;
        if(!sort){
            res = await collection.find(query).toArray();
            return res;     
        } else {
            res = await collection.find(query).sort(sort).toArray();
            return res;   
        }
  

    } catch(e) {
        console.log(e);
    }
}

async function run(querry, sort = null, type){
    let connection = {}
    try{
        connection = await connect();
        let res;
        if(type == 'find'){
            res = await query(connection.db, querry, sort);
        } else {
            res = await agg(connection.db, querry);
        }
        
        return res;

    } catch(e) {

        console.log(e);
        await close(connection.client);
    } finally {
        await close(connection.client);
    }

} 

async function insertData(data){
    let connection = {}
    try{

        connection = await connect();
        const collection = connection.db.collection('products');
        const result = await collection.insertMany(data);

        return result;

    } catch(e) {

        console.log(e);
        await close(connection.client);
    } finally {
        await close(connection.client);
    }
}

module.exports.getQuery = run;
module.exports.insertData = insertData;