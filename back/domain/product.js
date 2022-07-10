let db = [];

const Product = class Product {

    constructor(id, name, price, img, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.stock = stock;
    }

    static getAll() {
        return db;
    }

    static getById(id) {
        return db.find(product => product.id == id);
    }
}

const dir_images = '/images/';

db.push(new Product(1, 'Apple juice', 2.99, `${dir_images}apple-juice.jpg`, 8));
db.push(new Product(2, 'Almond milk', 8.99, `${dir_images}almod-milk.jpg`, 3));
db.push(new Product(3, 'Grape juice', 3.99, `${dir_images}grape-juice.png`, 0));
db.push(new Product(4, 'Milk', 0.99, `${dir_images}milk.jpg`, 20));
db.push(new Product(5, 'Aquafina 24', 4.99, `${dir_images}aquafina.jpg`, 12));
db.push(new Product(6, 'Pepperoni pizza', 3.99, `${dir_images}pizza.png`, 15));
db.push(new Product(7, 'Baguette', 1.29, `${dir_images}baguette.jpeg`, 8));


module.exports = Product;