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

app.get('/products/?:id', async function (request, response, next) {
  console.log(request.params);
  console.log(request.query);

  id = request.params.id;
  if (id == "search") {
    next();
  } else {
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
  let limit = 12;
  let price = -1;
  let brand = null;

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
  result = await db.getProducts({limit, price, brand})
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

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
