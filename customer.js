var mysql = require('mysql')
var inquirer = require('inquirer')
var ctable = require('console.table')

var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "",
    database: "bamazon"
});

var initconnect = function () {

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        var query = connection.query(
            "SELECT id, product_name, price FROM products",
            function (err, res) {
                if (err) throw err;
                console.table(res)
                start()
            })
    })
}

initconnect()

var start = function () {
    inquirer.prompt([{
            type: "input",
            name: "itemID",
            message: "Enter the ID of the item you would like to buy",
        },
        {
            type: "input",
            name: "units",
            message: "How many would you like?"
        },

    ]).then(function (data) {
        query = connection.query(
            "SELECT * FROM products where id = ?", [data.itemID],
            function (err, res) {
                if (err) throw err;
                var currentq = parseInt(res[0].stock_quantity)
                var product = res[0].product_name
                var reqUnits = parseInt(data.units)
                var price = res[0].price * reqUnits
                var ID = res[0].id

                console.log("price: " + price)

                if (reqUnits > currentq) {
                    insufficientQ()
                } else {
                    console.log("Thanks for buying " + data.units + " " + product)

                    totalUnits = currentq - reqUnits

                    query = connection.query(
                        "UPDATE products SET stock_quantity = ? WHERE id = ?", [totalUnits, ID],

                        function (err, res) {
                            if (err) throw err;
                            console.log("Your total is $" + price + ".")
                            finish() 
                        }

                    )
                }
            })
    })
}

var insufficientQ = function () {
    console.log("insufficient quantity, try again!")
    inquirer.prompt([{
            type: "confirm",
            name: "next",
            message: "Would you like to try again?",
        }])

        .then(function (data) {
            if (data.next === true) {
                start()
            } else {
                console.log("Thanks for shopping at bamazon!")
                connection.end()
            }
        })
}

var finish = function () {
    inquirer.prompt([{
            type: "confirm",
            name: "keepShopping",
            message: "Would you like to buy another item?"
        }])
        .then(function (data) {
            if (data.keepShopping === true) {
                start()
            } else {
                console.log("Thanks for shopping at bamazon!")
                connection.end()
            }
        })
}

