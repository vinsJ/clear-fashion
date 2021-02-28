/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrands = require('./sources/mudjeansbrands');
const adresseparisbrands = require('./sources/adresseparisbrands')

const fs = require('fs')

class Brands {
  constructor(brandName, url, products){
    this.brand = {'name': brandName, url, products};
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

    //const jsonContent = JSON.stringify(products);
    console.log(products);
    console.log('Done scraping');

    const myBrand = new Brands(brand, url, products);
    arrayBrands = []; 
    arrayBrands.push(myBrand);

    const jsonContent = JSON.stringify(arrayBrands);

    fs.writeFile("./products.json", jsonContent, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      process.exit(0);
  }); 

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function updateFile(fileName, brand, products){
  fs.readFile('./' + fileName, 'utf-8', (err, data) => {
    if(err) {
      throw err;
    }

    fileF = JSON.parse(data.toString());
    fileF

  })
}

//TODO: Check is product exists before saving 
//TODO: Do not erase all JSON, save product in the array of the brand

//* scrap additional information for Adresse-Paris (and check if we scrap all the products) => DONE 

const [,, eshop] = process.argv;

sandbox(eshop);

//updateFile("products.json", null);
