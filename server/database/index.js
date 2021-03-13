creds = require('./creds.json')

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://' + creds.user + ':' + creds.password + '@' + creds.cluster_url + '?retryWrites=true&w=majority'
const MONGODB_DB_NAME = 'clear-fashion';

let client = new MongoClient(MONGODB_URI,  {'useUnifiedTopology': true});
let db = null;

async function connect(){
    if(db){
        console.log("Already connected ! 🔌⚡");
        return db;
    }
    try{
        await client.connect();
        db =  client.db(MONGODB_DB_NAME)
        console.log("Connected ! 🦄")
        return db;
    } catch(e){
        console.log("🚨", e);
    }

}

async function close(client){
    try{
        await client.close();
        console.log("Disconected ! 🔌🪓")
    } catch(e) {
        console.log("🚨", e);
    }

}

async function agg(db, query){
    try {
        const collection = db.collection('products');
        const res = await collection.aggregate(query, { "allowDiskUse" : true }).toArray();
        return res;
    } catch(e) {
        console.log("🚨", e);
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
        console.log("🚨", e);
    }
}

async function run(querry, sort = null, type){
    try{
        console.log("Connection ... 🦄")
        db = await connect();
        let res = "";
        if(type == 'find'){
            res = await query(db, querry, sort);
        } else {
            res = await agg(db, querry);
        }
        return res;
    } catch(e) {
        console.log("🚨", e);
    } 

} 

async function insertData(data){
    try{
        db = await connect();
        const collection = db.collection('products');
        const result = await collection.insertMany(data);
        return result;

    } catch(e) {
        console.log("🚨", e);
    }
}

module.exports.getQuery = run;
module.exports.insertData = insertData;