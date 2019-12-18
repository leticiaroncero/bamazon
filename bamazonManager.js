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
    showOptions();
});

var table = new Table({
    head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']
    , colWidths: [9, 20, 20, 8, 16]
});

function showOptions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    displayProducts();
                    break;

                case "View Low Inventory":
                    displayLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;
            }
        });
}

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
    })
};

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
    })
}

function addToInventory() {
    inquirer
        .prompt([{
            type: "input",
            name: "product_id",
            message: "What is the ID of the item you would like to add to your inventory?",
            validate: function (input) {
                if (isNaN(input) || input < 0) {
                    return "Please, type a valid number";
                } else {
                    return true;
                }
            }
        },
            {
                type: "input",
                name: "quantity",
                message: "How many items would you like to add?",
                validate: function (input) {
                    if (isNaN(input) || input < 0) {
                        return "Please, type a valid number";
                    } else {
                        return true;
                    }
                }
            }]).then(function (answer) {
                var itemToAdd = answer.product_id;
                var quantityToAdd = parseInt(answer.quantity);
                connection.query("UPDATE products SET stock_quantity=stock_quantity+? WHERE ?", [
                    quantityToAdd,
                    {
                        item_id: itemToAdd,
                    }], function (err, res) {
                        console.log("Added " + quantityToAdd + " new items to your stock.");
                    }
                );
            })
}