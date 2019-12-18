DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10, 2) NOT NULL, 
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("Kids Car & Toy Carpet", "Games", 24.95, 20),
    ("Alexa Echo Dot Smart Speaker", "Electronics", 24.99, 50),
    ("Fujifilm Instax Camera", "Electronics", 59.99, 30),
    ("Donkey Kong Nintendo Switch Game", "Games", 54.95, 60),
    ("The Great Gatsby (Classics)", "Books", 14.62, 10),
    ("High Waist Yoga Pants", "Clothing", 89.00, 100),
    ("Window Cleaner", "Gardening", 8.02, 120),
    ("Crunchy Cat Treats", "Pet Supplies", 15.78, 160),
    ("Waterproof Bluetooth Speaker", "Electronics", 79.95, 5),
    ("Ugly Christmas Sweater", "Clothing", 29.99, 4);
