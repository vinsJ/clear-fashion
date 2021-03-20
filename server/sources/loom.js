const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('./myProduct');

const brandName = "Loom";

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('.product-grid__item')
    .map((i, element) => {
      const link = `https://www.loom.fr${$(element)
        .find('.product-title a')
        .attr('href')}`;

        const price = parseFloat(
          $(element)
            .find('.money')
            .text());

        const name = $(element)
          .find('.product-title')
          .text()
          .trim()
          .replace(/\s/g, ' ');

        const image =  $(element)
          .find('noscript img.product_card__image')
          .attr('src');

        let linkImages = [image];

        if(link){
          let product = new Product(name, price, linkImages, brandName, link);
          return product;
        }
    })
    .get();
};

module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
