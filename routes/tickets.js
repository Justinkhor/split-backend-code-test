var express = require('express');
var router = express.Router();
var moment = require('moment');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

/*

Assignment 1

*/
router.post('/oneSettlementPerWeek', function(req, res, next) {
    // use req.body to get JSON of start and end dates. We are only concerned with end dates.
    let endDate = moment(req.body['end'],'DD-MM-YYYY')
    
    //add changes below
    // add one week and get the date of Monday 
    var paymentDate = moment(endDate).add(1, "w").startOf('isoweek')

    res.json({"paymentDate":moment(paymentDate).format('DD-MM-YYYY')})
});

router.post('/twoSettlementPerWeek', function(req, res, next) {
    let endDate = moment(req.body['end'],'DD-MM-YYYY')

    //add changes below
    if (endDate.isoWeekday() < 4) {
        // get date of Thursday
        var paymentDate = moment(endDate).isoWeekday(4);
    }

    else {
        // add one week and get the date of Monday 
        var paymentDate = moment(endDate).add(1, "w").startOf('isoweek')
    }
    res.json({"paymentDate":moment(paymentDate).format('DD-MM-YYYY')})
});


/*

Assignment 2

*/
router.post('/calculateSettlementAmount', function(req, res, next) {

    //add changes below
    var total = 0

    for (n in req.body) {
        total += req.body[n].price * (1 - req.body[n].MDR / 100)
    }
   
    res.json({"totalSum": Math.ceil(total * 100) / 100})
});


/*

Assignment 3

Create API to CRUD function for tickets
Use NPM sqlite3 save the tickets 
https://www.npmjs.com/package/sqlite3

Ticket

{
  "ticketId":"TES2312-32",
  "price" , "203.10",
  "MDR" : "2.0",
  "currency" : "SGD",
  "travelAgentName" : "SPLIT-TEST-AGENT01"
}


Provide a solution to restart the app instance if it crashes.

*/

// POST
router.post("/", function (req, res, next) {
    let ticketId = req.body.ticketId
    let price = req.body.price
    let MDR = req.body.MDR
    let currency = req.body.currency
    let travelAgentName = req.body.travelAgentName

    db.serialize(() => {
        // create table if not created
        db.run("CREATE TABLE IF NOT EXISTS tickets (ticketId TEXT PRIMARY KEY, price DECIMAL, MDR DECIMAL, currency TEXT, travelAgentName TEXT)", (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
        })

        // if table already created then insert
        db.run("INSERT INTO tickets (ticketId, price, MDR, currency, travelAgentName) VALUES (?, ?, ?, ?, ?)", [ticketId, price, MDR, currency, travelAgentName], (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            res.json({
                message: "success"
            })
        })
    })
});

// GET
router.get("/", function (req, res, next) {
    db.all("SELECT * FROM tickets", (err, rows) => {
        if (err) {
            return console.error(err.message)
        }
        res.json({
            message: "success",
            tickets: rows
        })
    })
});

// PUT
router.put("/:ticketId", function (req, res, next) {
    let ticketId = req.params
    let price = req.body.price
    let MDR = req.body.MDR
    let currency = req.body.currency
    let travelAgentName = req.body.travelAgentName

    db.run("UPDATE tickets SET price = ?, MDR = ?, currency = ?, travelAgentName = ? WHERE ticketId = ?", [price, MDR, currency, travelAgentName, ticketId], (err) => {
        if (err) {
            return console.error(err.message)
        }
        res.json({
            message: "success"
        })
    })
});

// DELETE
router.delete("/:ticketId", function (req, res, next) {
    let ticketId = req.params
    db.run("DELETE FROM tickets WHERE ticketId = ?", [ticketId], (err) => {
        if (err) {
            return console.error(err.message)
        }
        res.json({
            message: "success"
        })
    })
});


/*

Assignment 4
Ensure the nodejs app process restart itself when it crash

Solution:
    - Nodemon will be good for debugging purposes during the development stage where it monitors changes to the code and restarts the application.
    - Forever ensures that an application runs continuously in production and restarts it when it faces unexpected crashes.
    - PM2 is the best solution in the production stage where it will automatically restart the application when one of the processes crashes.
*/

//Custom GET API that will crash the app
router.get('/crashApp', function(req, res, next) {
    let totalSum = []
    while(true){
        let temp = {"test": 123, "data": [1,2,4,56,23,23,]}
        totalSum.push(temp)
    }
    res.json({"message":"This will not be return as app will crash"})
});

/*

Assignment 5
Determine if input string is valid

An input string is valid if the following rules are followed:
- An open character must be closed by the same type of character.
- An open character must be closed in the correct order.

*/

router.post('/validate', function(req, res, next) {
    let string = req.body['input'].toLowerCase()
    let chars = 'abcdefghijklmnopqrstuvwxyz'
    var stack = []

    for (n in string) {
        if (chars.includes(string[n])){
            if (!stack.includes(string[n])){
                stack.push(string[n])
            }

            else {
                if (stack.includes(string[n], -1)){
                    stack.pop()
                }
                else {
                    res.json({compile: false})
                    break
                }
            }
        }

        else {
            throw "Invalid String"
        }
    }
  
    res.json({compile: true});
});

module.exports = router;