const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const db = require('./database/api-db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

app.get('/products/:id', async function (request, response, next) {
  id = request.params.id;
  if (id == "search") {
    next();
  } else {
    console.log("products/:id triggered... 🕵️‍♀️")
    db.getProductID(id).then(result => {
      if (result) {
        if (result.length >= 1) {
          response.send({ 'status': 200, 'product': result });
        } else {
          response.send({ 'status': 404, 'message': 'No item found' });
        }
      } else {
        response.send({ 'status': 500, 'message': 'Could not access database' });
      }
    });
  }
});

app.get('/products/search', async function (request, response) {
  //console.log("products/search triggered... 🕵️‍♀️")
  let limit = 12;
  let price = 0;
  let brand = null;
  let page = 0;

  // retrieving parameters
  if(request.query.limit){
    limit = parseInt(request.query.limit);
  }

  if(request.query.price){
    price = parseFloat(request.query.price);
  }

  if(request.query.brand){
    brand = request.query.brand;
  }

  if(request.query.page){
    page = parseInt(request.query.page);
  }

  result = await db.getProducts({limit, price, brand, page})
  if (result) {
    if (result.products.length >= 1) {
      response.send({ 'status': 200, 'result': result });
    } else {
      response.send({ 'status': 204, 'message': 'No item found for given parameters', 'parameters' : {price, brand, limit, page} });
    }
  } else {
    response.send({ 'status': 500, 'message': 'Could not access database' });
  }
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);