DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INT,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
('facewash', 'personal care', 6.55, 10),
('coffee beans', 'grocery', 7.99, 10),
('bananas', 'grocery', 0.49, 10),
('cat food', 'pet care', 15.79, 1),
('phone chargers', 'technology', 7, 19)
-- things you want to add go here
