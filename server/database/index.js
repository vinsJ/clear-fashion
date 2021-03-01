creds = require('./creds.json')

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://' + creds.user + ':' + creds.password + '@' + creds.cluster_url + '?retryWrites=true&w=majority'
const MONGODB_DB_NAME = 'clearfashion';

const client = new MongoClient(MONGODB_URI,  {'useUnifiedTopology': true});

async function connect(){

    await client.connect();
    const db =  client.db(MONGODB_DB_NAME)

    return {client, db};
}

async function query(db, query) {
    try{
        const collection = db.collection('brands');
        const res = await collection.find(query).toArray();
        return res;       

    } catch(e) {
        console.log(e);
    }
}

async function close(client){
    try{
        await client.close();
    } catch(e) {
        console.log(e);
    }

}

async function run(querry){
    let connection = {}
    try{

        connection = await connect();
        let res = await query(connection.db, querry);
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
        const collection = connection.db.collection('brands');
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