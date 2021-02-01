/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrands = require('./sources/mudjeansbrands');
const adresseparisbrands = require('./sources/adresseparisbrands')

const fs = require('fs')

async function sandbox (brand = None) {
  try {
    console.log(`🕵️‍♀️  browsing ${brand} source`);

    let products = [];

    if(brand == 'Dedicated'){
      url = 'https://www.dedicatedbrand.com/en/men/news'
      products = await dedicatedbrand.scrape(url);
    } else if(brand == 'MudJeans') {
      url = 'https://mudjeans.eu/collections/men'
      products = await mudjeansbrands.scrape(url);
    } else if(brand == 'AdresseParis'){
      url = 'https://adresse.paris/630-toute-la-collection'
      products = await adresseparisbrands.scrape(url);
    }

    const jsonContent = JSON.stringify(products);

    console.log(products);
    console.log('Done scraping');

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

const [,, eshop] = process.argv;

sandbox(eshop);
//testData2();
