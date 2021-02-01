// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentFavsProducts = [];
let currentPagination = {};

let currentFilters = {
  "brand":"all",
  "checkReasonable":false,
  "checkRecently":false,
  "checkFavs":false,
  "sort":"none"
};
let currentIndicators = {
  "nbProductDisplayed":0,
  "p50":0,
  "p90":0,
  "p95":0,
  "lastDate":""
}

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');

const sectionProducts = document.querySelector('#products');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbProductsDisplayed = document.querySelector('#nbProductsDisplayed');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLastDate = document.querySelector('#lastReleasedDate');

const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');

const checkReasonable = document.querySelector('#CheckReasonablePrice');
const checkRecently = document.querySelector('#CheckRecentlyReleased');
const checkFavs = document.querySelector('#checkFav');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  currentIndicators["nbProductDisplayed"] = products.length;
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
        return `
        <div class="product" id=${product.uuid}>
          <span>${product.brand}</span>
          <a href="${product.link}" target="_blank">${product.name}</a>
          <span>${product.price}</span>
        </div>
      `;      
    })
    .join('');
  
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrands = products => {
  let setBrands = new Set([]);
  products.forEach(product => {
    setBrands.add(product.brand);
  })

  let options = '<option value="all">All</option>';
  options += Array.from(
    {'length': setBrands.size},
    (value, index) => `<option value="${Array.from(setBrands)[index]}">${Array.from(setBrands)[index]}</option>`
  ).join('');
  
  selectBrand.innerHTML = options;
  selectBrand.selectedIndex = 0;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  spanNbProductsDisplayed.innerHTML = currentIndicators['nbProductDisplayed'];
  spanP50.innerHTML = currentIndicators["p50"];
  spanP90.innerHTML = currentIndicators["p90"];
  spanP95.innerHTML = currentIndicators["p95"];
  spanLastDate.innerHTML = currentIndicators["lastDate"];

};

const render = (products, pagination) => {
  updateIndicatorsPrice(products);
  renderBrands(products);
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * 
 * Indicator section
 * 
 * 
 */

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

const updateIndicatorsPrice = products => {

  if(products.length == 0){
    currentIndicators["p50"] = 0;
    currentIndicators["p90"] = 0;
    currentIndicators["p95"] = 0;

    currentIndicators["lastDate"] = "None";
    return ;
  }

  let listPrice = []
  products.forEach(prod => {
    listPrice.push(prod.price);
  })
  
  currentIndicators["p50"] = Math.round(quantile(listPrice,.50));
  currentIndicators["p90"] = Math.round(quantile(listPrice,.90));
  currentIndicators["p95"] = Math.round(quantile(listPrice,.95));

  const productsSorted = JSON.parse(JSON.stringify(products));
  currentIndicators["lastDate"] = productsSorted.sort(function(a, b){return Date.parse(b.released)-Date.parse(a.released)})[0].released;

};


 /**
  * 
  *  End of Indicator secion
  * 
  * 
  */

/**
 * 
 * Filter Section 
 * 
 * const filter => Main filter function. Will decide what filter to apply 
 * 
 * 
 */


const filter = (productsArray, filters) => {
  let products = JSON.parse(JSON.stringify(productsArray));
  products = filterProductBrand(products, filters["brand"]);

  if(filters["checkReasonable"] == true){
    products = filterPrice(products, 50, "asc")
  }

  if(filters["checkRecently"] == true){
    products = filterProductDate(products, 14, "asc");
  } 

  if(filters["checkFavs"] == true){
    products = products.filter(product => currentFavsProducts.includes(product.uuid) == true);
  }

  const filter = filters["sort"];
  if(filter != "none"){
    if(filter == "date-asc"){
      products = products.sort(function(a, b){return Date.parse(a.released)-Date.parse(b.released)});
    }  else if(filter == "date-desc") {
      products = products.sort(function(a, b){return Date.parse(b.released)-Date.parse(a.released)});
    } else if(filter == "price-asc"){
      products = products.sort(function(a,b){return a.price - b.price});
    } else if(filter == "price-desc"){
      products = products.sort(function(a,b){return b.price - a.price});
    }
  }

  updateIndicatorsPrice(products);
  return products;
}

const filterProductBrand = (products, brand) => {
  if(brand == "all"){
    return products;
  }

  return products.filter(product => product.brand === brand);
};

function dateDiffInDays(a, b) {
  const msPerDay = 1000*60*60*24;
  // Discard the time and time-zone information.
  const diffInTime = b.getTime() - a.getTime();
  return diffInTime / msPerDay
}

const filterProductDate = (products, day, order) =>{
  let listProd = [];

  let dateNow = new Date(Date.now());
  dateNow.setHours(1);

  products.forEach(prod => {
    const dateProd = new Date(prod.released);

    if(order == "asc"){
      if(Math.round(dateDiffInDays(dateProd, dateNow)) <= day){
        listProd.push(prod)
        listProd = listProd.sort(function(a, b){return Date.parse(a.released)-Date.parse(b.released)});
      }
    } else {
      if(Math.round(dateDiffInDays(dateProd, dateNow)) >= day){
        listProd.push(prod)
        listProd = listProd.sort(function(a, b){return Date.parse(b.released)-Date.parse(a.released)});
      }
    }
  })


  return listProd;
};

const filterPrice = (products, price, order) =>{
  if(order == "asc"){
      products = products.filter(product => product.price <= price);
      return products.sort(function(a,b){return a.price - b.price});
  }

  products = products.filter(product => product.price >= price);
  return products.sort(function(a,b){return b.price - a.price});

};

/**
 * 
 * End of Filter section
 * 
 */


/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(filter(currentProducts,currentFilters)));
});
/** 
* Select the page of products to display
* @type {[type]}
*/
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render(filter(currentProducts,currentFilters)));
});

selectBrand.addEventListener('change', event => {
  currentFilters["brand"] = event.target.value;
  renderProducts(filter(currentProducts,currentFilters));
  renderIndicators(currentPagination);
});

selectSort.addEventListener('change', event => {
  currentFilters["sort"] = event.target.value;
  renderProducts(filter(currentProducts, currentFilters));
  renderIndicators(currentPagination);
});

checkReasonable.addEventListener('change', function() {
  currentFilters['checkReasonable'] = this.checked;
  renderProducts(filter(currentProducts,currentFilters));
  renderIndicators(currentPagination);
});

checkRecently.addEventListener('change', function() {
  currentFilters['checkRecently'] = this.checked;
  renderProducts(filter(currentProducts,currentFilters));
  renderIndicators(currentPagination);
});

checkFavs.addEventListener('change', function() {
  currentFilters['checkFavs'] = this.checked;
  renderProducts(filter(currentProducts,currentFilters));
  renderIndicators(currentPagination);

  currentFavsProducts.forEach(function(uuid) {
    document.getElementById(uuid).className = 'product fav';
  });
  
});

sectionProducts.addEventListener('click', function(e) {
  if(currentFavsProducts.includes(e.target.id)){
    currentFavsProducts.splice(currentFavsProducts.indexOf(e.target.id));
    e.target.className = 'product';
  } else {
    currentFavsProducts.push(e.target.id);
    e.target.className = 'product fav';
  }
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);
