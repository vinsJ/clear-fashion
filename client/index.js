// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}]

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);





/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable

const link = "https://www.loom.fr";


/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable

const marketplaceLength = marketplace.length;
console.log("This is the length of marketplace: ", marketplaceLength);


// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have

const listBrands = [];

marketplace.forEach(brands => listBrands.push(brands.brand));
const setUnique = new Set(listBrands)

console.log("This is the list of brands in marketplace", setUnique);


// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable

function sortMarketByPrice( a, b ) {
  if ( a.price < b.price ){
    return -1;
  }
  if ( a.price > b.price ){
    return 1;
  }
  return 0;
}

const marketPlaceSortedPrice = marketplace;
marketPlaceSortedPrice.sort(sortMarketByPrice);

console.log("Sorted by price", marketPlaceSortedPrice);



// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable

function sortMarketByDate( a, b ) {
  if ( a.date < b.date ){
    return -1;
  }
  if ( a.date > b.date ){
    return 1;
  }
  return 0;
}

const marketPlaceSortedDate = marketplace;
marketPlaceSortedDate.sort(sortMarketByDate);

console.log("Sorted by date", marketPlaceSortedPrice);

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list

const marketPlaceFilterPriceRange = marketplace.filter(function(brands) {
  return brands.price >= 50 && brands.price <= 100
});

console.log("Filtered by range price", marketPlaceFilterPriceRange)


// 🎯 TODO: Average Basket
// 1. Determine the average basket of the marketplace
// 2. Log the average

const listPrices = [];
marketplace.forEach(brands => listPrices.push(brands.price));

function averageBasket(listPrices){
  let total = 0;

  for(var i = 0; i < listPrices.length; i++){
    total += listPrices[i];
  }

  return total / listPrices.length
}

console.log("This is the average basket of the marketplace", Math.round(averageBasket(listPrices)), "€");



/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands

function createBrands(){
  let res = {};
  setUnique.forEach(name => res[name] = [])
  return res;
}

function init(){
  let brands = createBrands();
  marketplace.forEach(el => {
  if(!brands[el.brand].includes(el.name)){
    brands[el.brand].push({'name': el.name, 'price': el.price, 'link': el.link, 'date':el.date})
  }
});
  return brands;
}

let brands = init()

console.log("This is the list of item per brand", brands);

for( const[key,value] of Object.entries(brands)){
  console.log(`${key} has ${value.length} products`)
}

// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort

for( const[key,value] of Object.entries(brands)){
  value.sort(sortMarketByPrice);
}
console.log("Brands sorted by price", brands)



// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort

for( const[key,value] of Object.entries(brands)){
  value.sort(sortMarketByDate);
}




/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

const p90b = []

const test = []

// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

function listPriceBrands(){
  let brandsPrice = createBrands();
  for(const[key,value] of Object.entries(brands)){
    var listPricesb = []
    value.forEach(el => {
    listPricesb.push(el.price)
    });
    brandsPrice[key] = quantile(listPricesb, .50);

  }
  return brandsPrice;
}


console.log(listPriceBrands())




/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.


// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€


// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product

function findProduct(uuid){
  var elem;
  COTELE_PARIS.forEach(el => {
    if(el.uuid == uuid){
      elem = el;
    }
  });
  return elem;
}

let prod = findProduct("b56c6d88-749a-5b4c-b571-e5b5c6483131");
console.log("Product with uuid b56c6d88-749a-5b4c-b571-e5b5c6483131: ", prod.name);


// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product

console.log("Initial length: ", COTELE_PARIS.length);
const id = "b56c6d88-749a-5b4c-b571-e5b5c6483131";
let COTELE_PARIS_rm = COTELE_PARIS.filter(prod => prod.uuid != id)
console.log(COTELE_PARIS_rm);


// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;
jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

console.log("Blue jacket: " + JSON.stringify(blueJacket));
console.log("Copied Jacket: " + JSON.stringify(jacket));

// 2. It's a shallow copy, so it has a reference to the original object. Any modification will affect both objects.

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties
let jacket2 = JSON.parse(JSON.stringify(blueJacket));
jacket2.favorite = true;

console.log("Jacket deep copied: " + JSON.stringify(jacket2));
console.log("Blue Jacket: " + JSON.stringify(blueJacket));



/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage

localStorage.MY_FAVORITE_BRANDS = MY_FAVORITE_BRANDS;