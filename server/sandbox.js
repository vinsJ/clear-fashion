/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrands = require('./sources/mudjeansbrands');
const adresseparisbrands = require('./sources/adresseparisbrands')

const fs = require('fs')

const db = require('./database');

class Brands {
  constructor(brandName, url, products){
    this.name = brandName
    this.url = url
    this.products = products
  }
}

async function sandbox (brand = None) {
  try {
    console.log(`🕵️‍♀️  browsing ${brand} source`);
    let url = "";
    let products = [];
    if(brand == 'Dedicated'){
      url = 'https://www.dedicatedbrand.com/en/men/news'
      //products = await dedicatedbrand.scrape(url);
      products = await dedicatedbrand.getAPI('https://www.dedicatedbrand.com/en/loadfilter?category=men');
    } else if(brand == 'Mud-Jeans') {
      url = 'https://mudjeans.eu/collections/men'
      products = await mudjeansbrands.scrape(url);
    } else if(brand == 'Adresse-Paris'){
      url = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=110'
      products = await adresseparisbrands.scrape(url);
    } else {
      console.log("sorry, the brand you're looking for doesn't exists here");
      process.exit(0);
    }

    console.log('Done scraping');

    const myBrand = new Brands(brand, url, products);
    arrayBrands = []; 
    arrayBrands.push(myBrand);

    const jsonContent = JSON.stringify(arrayBrands);

    updateFile('products.json', myBrand);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function updateFile(fileName, brandUpdated){
  fs.readFile('./' + fileName, 'utf-8', (err, data) => {
    if(err) {
      throw err;
    }

    fileF = JSON.parse(data.toString());
    brand = fileF.find(b => b.name == brandUpdated.name);

    (brand) ? brand.products = brandUpdated.products : fileF.push(brandUpdated);

    fs.writeFile('./' + fileName, JSON.stringify(fileF), 'utf-8', function (err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
      process.exit(0);
    });

  });

}


function uploadData(){

  fs.readFile('./products.json', 'utf-8', (err, data) => {
    if(err){
      throw err;
    }

    fileF = JSON.parse(data.toString());
    if(fileF){
      res = db.insertData(fileF).then()
      if(res.insertedCount = fileF.length){
        console.log("Upload succesfull");
      } else {
        console.log(res);
      }
    }
  });
}

async function getProducts(brandName = null, price = null){
  if(brandName){
    let res = await db.getQuery({name: brandName});
    console.log(res.products);
  }

  if(price){
    let res = await db.getQuery({products: {$elemMatch: {"price.price" : {$lt :price}}}});

    fs.writeFile('./' + 'test.json', JSON.stringify(res), 'utf-8', function (err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
      process.exit(0);
    });
  }
}

//! Check is product exists before saving => Not useful since I have to go through all the JSON check if there is any modification, delete objects that are not in the
//* Do not erase all JSON, save product in the array of the brand => Done
//* scrap additional information for Adresse-Paris (and check if we scrap all the products) => DONE 

const [,, eshop] = process.argv;

//sandbox(eshop);
//uploadData();
//db.getQuery({name: 'Mud-Jeans'});

getProducts(null, 30);



