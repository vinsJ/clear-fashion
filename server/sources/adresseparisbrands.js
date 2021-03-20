const axios = require('axios');
const cheerio = require('cheerio');

const Product = require('./myProduct');

const brandName = "Adresse-Paris";

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list .product-container')
    .map((i, element) => {

      const link = $(element)
        .find('.product_img_link')
        .attr('href')

      const name = $(element)
        .find('.product-name')
        .attr('title');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      const oldPrice = parseInt(
        $(element)
          .find('.old-price')
          .text()
      );

      let images = $(element)
        .find('.product_img_link')
        .children()

      let linkImages = []

      try {
        linkImages.push(images[0].attribs["data-original"]);
        linkImages.push(images[1].attribs["data-rollover"]);
      } catch {

      }
      if(link){
        let product = new Product(name, parseFloat(price), linkImages, brandName, link);
        return product;
      }

      //return {name, 'price' : {'price' : price, 'priceBeforeDiscount' : oldPrice, discount : price- oldPrice}, 'images' : linkImages};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
