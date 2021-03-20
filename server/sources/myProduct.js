// Here is the structure of our products.

const {'v5': uuidv5} = require('uuid');
var datetime = new Date();

module.exports = class Product {
    constructor(nameP, price, images, brandName, link){
        this.nameP = nameP, // string
        this.price = price, // float 
        this.images = images // [string]
        this.brandName = brandName, // string
        this.link = link,
        this.uuid = uuidv5(link, uuidv5.URL),
        this.date = datetime.toISOString().slice(0,10)
    }

    display() {
        console.log(`Brand: ${this.brandName} | Name: ${this.nameP} | Price: ${this.price} | Nb of images: ${this.images.length} | Link; ${this.link}`);
    }
}