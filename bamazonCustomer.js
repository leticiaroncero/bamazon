require("dotenv").config();
var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayProducts();
});

var table = new Table({
    head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']
    , colWidths: [9, 20, 20, 8, 16]
});

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());

        shopAssistant();
    })
};

function validateNumber(input) {
    if (isNaN(input) || input < 0) {
        return "Please, type a valid number";
    } else {
        return true;
    }
}

function shopAssistant() {
    inquirer.prompt([{
        type: "input",
        name: "product_id",
        message: "What is the ID of the item you would like to purchase?",
        validate: validateNumber
    }, {
        type: "input",
        name: "quantity",
        message: "How many would you like?",
        validate: validateNumber
    }]).then(function (answer) {
        var productRequest = answer.product_id;
        var quantityRequest = parseInt(answer.quantity);
        inStock(productRequest, quantityRequest);
    });
};

function inStock(itemId, quantity) {
    connection.query("SELECT product_name, stock_quantity, price FROM products WHERE ?",
        {
            item_id: itemId
        },
        function (err, res) {
            if (err) throw err;

            if (res.length == 0) {
                console.log("Item doesn't exist");
            } else if (res[0].stock_quantity >= quantity) {
                var itemPrice = res[0].price;
                fullfillOrder(itemId, res[0].stock_quantity, quantity, itemPrice);
            } else {
                console.log("Insufficient quantity!");
            }
        })
};

function fullfillOrder(itemId, stockQuantity, quantity, itemPrice) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stockQuantity - quantity,
            },
            {
                item_id: itemId,
            }
        ],
        function (err, res) {
            console.log("Your total is: " + itemPrice * quantity);
            connection.end();
        }
    );
};
