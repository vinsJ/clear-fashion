// Here is the structure of our products.

module.exports = class Product {
    constructor(nameP, price, images, brandName){
        this.nameP = nameP, // string
        this.price = price, // float 
        this.images = images // [string]
        this.brandName = brandName // string
    }

    display() {
        console.log(`Brand: ${this.brandName} | Name: ${this.nameP} | Price: ${this.price} | Nb of images: ${this.images.length}`)
    }
}