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
    console.log("connected as id " + connection.threadId + "\n");
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
    if (isNaN(input)) {
        return "Please, type a number";
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
        var quantityRequest = answer.quantity;
        inStock(productRequest, quantityRequest);
    });
};

function inStock(itemId, quantity) {
    connection.query("SELECT product_name, stock_quantity FROM products WHERE ?",
        {
            item_id: itemId
        },
        function (err, res) {
            if (err) throw err;

            if (res.length == 0) {
                console.log("Item doesn't exist");
            } else if (res[0].stock_quantity >= quantity) {
                fullfillOrder();
            } else {
                console.log("Insufficient quantity!");
            }
        })
};

function fullfillOrder() { }
