var mysql = require('mysql')
var inquirer = require('inquirer')
var ctable = require('console.table')

var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon"
});

var initconnect = function () {

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        start()
    })
}

initconnect()

var start = function () {
    inquirer.prompt([{
        type: "list",
        name: "option",
        message: "What would you like to do?",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function (data) {
        if (data.option === 'View Products for Sale') {
            viewProducts()
        } else if (data.option === 'View Low Inventory') {
            viewLow()
        } else if (data.option === 'Add to Inventory') {
            addTo()
        } else {
            addNew()
        }

    })
}

var viewProducts = function () {
    var query = connection.query(
        "SELECT id, product_name, department_name, price, stock_quantity FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res)
            goAgain()
        })
}

var viewLow = function () {
    connection.query(
        "SELECT id, product_name, stock_quantity FROM products WHERE stock_quantity <= 6",
        function (err, res) {
            if (err) throw err;
            console.table(res)
            goAgain()

        })
}

var addTo = function () {
    connection.query(
        "SELECT id, product_name, stock_quantity FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res)
            inquirer.prompt([{
                type: "input",
                name: "id",
                message: "Enter the ID of the item you would like to update inventory for.",
            }, {
                type: "input",
                name: "amount",
                message: "Enter how many units you would like to add."
            }]).then(function (data) {
                query = connection.query(
                    "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [data.amount, data.id],
                    function (err) {
                        if (err) throw err;
                        console.log("Update was successful.")
                        goAgain()
                    }
                )
            })

        })

}

var addNew = function () {
    inquirer.prompt([{
        type: "input",
        name: "product",
        message: "Name of item to add: ",
    }, {
        type: "input",
        name: "department",
        message: "Department: "
    }, {
        type: "input",
        name: "price",
        message: "Price: "
    },{
        type: "input",
        name: "inventory",
        message: "Quantity to add: "
    }]).then(function (data) {
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: data.product,
                department_name: data.department,
                price: data.price,
                stock_quantity: data.inventory
            },
            function (err) {
                if (err) throw err
                console.log(data.product + " added successfully!")
                goAgain()
            })
     })


}

var goAgain = function () {
    inquirer.prompt([{
        type: "confirm",
        name: "again",
        message: "Would you like to do something else?"
    }]).then(function (data) {
        if (data.again === true) {
            start()
        } else {
            connection.end()
        }
    })
}