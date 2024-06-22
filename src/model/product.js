class Product {
    #id;
    #title;
    #description;
    #price;
    #thumbnail;
    #code;
    #stock;

    constructor(title, description, price, thumbnail, code, stock) {
        this.#title = title;
        this.#description = description;
        this.#price = price;
        this.#thumbnail = thumbnail;
        this.#code = code;
        this.#stock = stock;
       // this.#id=10;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get price() {
        return this.#price;
    }

    get thumbnail() {
        return this.#thumbnail;
    }

    get code() {
        return this.#code;
    }

    get stock() {
        return this.#stock;
    }

    get objectProduct() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            private: this.#price,
            thumbnail: this.#thumbnail,
            code: this.#code,
            stock: this.#stock,
        }
    }

    // Setters
    set id(newId) {
        this.#id = newId;
    }

    set title(newTitle) {
        this.#title = newTitle;
    }

    set description(newDescription) {
        this.#description = newDescription;
    }

    set price(newPrice) {
        this.#price = newPrice;
    }

    set thumbnail(newThumbnail) {
        this.#thumbnail = newThumbnail;
    }

    set code(newCode) {
        this.#code = newCode;
    }

    set stock(newStock) {
        this.#stock = newStock;
    }
}

module.exports = Product;
