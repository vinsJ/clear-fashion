const axios = require('axios');
const cheerio = require('cheerio');

const Product = require('./myProduct');
const brandName = "Mud-Jeans";

const parse = data => {
    const $ =  cheerio.load(data);
    return $('.content-row .product-link')
        .map((i, element) => {
            const nameP = $(element)
            .find('.product-title')
            .text()
            .trim()
            .replace(/\s/g, ' ');
            let price = $(element)
                  .find('.row .product-price:first')
                  .text();
            // The output is 'Buy€119,00\n', so we have to take a substring. 
            price = parseFloat(price.substring(
                price.lastIndexOf('€') + 1,
                price.length - 1
            ));

            let lease = $(element)
                .find('.row .product-price:last')
                .text();

            // In case a product isn't for lease 
            if(lease.includes('Lease')){
                lease = parseFloat(lease.substring(
                    lease.lastIndexOf('€') + 1,
                    lease.length
                ).replace(',','.'));
            } else {
                lease = null
            }

            prices = {price, lease}

            let imagesH = $(element)
                .find('.product-image');
            
            
            
            fImage = imagesH.find('.primary-image').find('picture').children().attr('media',' max-width: 320px')[0].attribs.srcset.split(',')[2].slice(0,-3);
            sImage = imagesH.find('.secondary-image').find('picture').children().attr('media',' max-width: 320px')[0].attribs.srcset.split(',')[2].slice(0,-3);
            images = [fImage,sImage];

            let link = "https://mudjeans.eu"
            link += $(element)
                .find(".product-image")
                .attr('href');

            if(link){
                let product = new Product(nameP, price, images, brandName, link);
                return product;
            }
           // return {'name': nameP, 'price' : prices, 'category': ['Jeans'], images};
        })
        .get();
}

module.exports.scrape = async url => {
    const response = await axios(url);
    const {data, status} = response;
  
    if (status >= 200 && status < 300) {
      return parse(data);
    }
  
    console.error(status);
  
    return null;
  };
