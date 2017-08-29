var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(results);

        inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the product you would like to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units would you like to purchase?"
            }
        ])
        .then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === answer.item_id) {
                    chosenItem = results[i];
                }
            }
            
            var totalStock = chosenItem.stock_quantity - parseInt(answer.units)
            console.log(totalStock);
            if (chosenItem.stock_quantity < parseInt(answer.units)) {
                console.log("Insufficient quantity!");
            }
            else {
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: parseInt(totalStock)
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Thank you for purchasing " + chosenItem.product_name + "! You will be charged $" + chosenItem.price + " for the item.");
                      }
                )
            }
          });
    });
}