const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = (data) => {
  const $ = cheerio.load(data);

  return $(".productList-container .productList")
    .map((i, element) => {
      const name = $(element)
        .find(".productList-title")
        .text()
        .trim()
        .replace(/\s/g, " ");
      const price = parseInt($(element).find(".productList-price").text());

      return { name, price };
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (url) => {
  const response = await axios(url);
  const { data, status } = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

const getCleanUri = (rawUri, nbSep) => {
  let numSep = 0;
  let cleanUri = "";

  for (var i = 0; i < rawUri.length; i++) {
    rawUri.charAt(i) == "/" && numSep++;
    if (numSep < nbSep) {
      cleanUri += rawUri.charAt(i);
    } else {
      return cleanUri;
    }
  }
  
};

module.exports.getAPI = async (url) => {
  const response = await axios(url);
  const { data, status } = response;

  categories = data.filterDescriptions.categories;

  products = data.products
    .filter((product) => product.length != 0)
    .map((rawProduct) => {
      var nbSep = (rawProduct.canonicalUri.match(/\//g) || []).length;
      var cleanUri = getCleanUri(rawProduct.canonicalUri, nbSep);

      product = {
        name: rawProduct.name,
        price: {
          price: rawProduct.price.priceAsNumber,
          priceBeforeDiscount: rawProduct.price.priceBeforeDiscountAsNumber,
          discount: rawProduct.price.discountPercent,
        },
        category: categories[cleanUri].split("::"),
        images: rawProduct.image,
      };

      return product;
    });

    return products;
};
