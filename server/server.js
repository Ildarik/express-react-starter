// var app = require("./app");
var debug = require("debug")("express-react:server");
var http = require("http");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(3001, () => console.log(`App listening on port 3001!`));

/**
 * connect to DB
 */

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rosbanK13",
  database: "ROSBANK"
});

connection.connect();

app.get("/rate", function(req, res) {
  let {
    deposite_sum,
    active_currency,
    deposite_type,
    maturity,
    payment_period,
    early_refund
  } = req.query;

  // Amount

  let amount_range = 3;

  if (deposite_sum <= 99999) {
    amount_range = 1;
  } else if (deposite_sum >= 100000 && deposite_sum <= 999999) {
    amount_range = 2;
  } else if (deposite_sum >= 1000000 && deposite_sum <= 9999999) {
    amount_range = 3;
  } else if (deposite_sum >= 10000000 && deposite_sum <= 99999999) {
    amount_range = 4;
  } else if (deposite_sum >= 100000000 && deposite_sum <= 999999999) {
    amount_range = 5;
  } else if (deposite_sum >= 1000000000) {
    amount_range = 6;
  }

  // currency

  let currency_id = 1;

  if (active_currency === "rub") {
    currency_id = 1;
  } else if (active_currency === "usd") {
    currency_id = 2;
  } else if (active_currency === "eur") {
    currency_id = 3;
  }

  // payment_period: 'month' | 'quarter' | 'year'

  let payment_period_id = 1;

  if (payment_period === "year") {
    payment_period_id = 1;
  } else if (payment_period === "quarter") {
    payment_period_id = 2;
  } else if (payment_period === "month") {
    payment_period_id = 3;
  }

  // early_refund: boolean

  let early_refund_id;

  early_refund_id = early_refund === true ? 2 : 1;

  // deposite_type

  if (!deposite_type) {
    deposite_type = 1;
  }

  // maturity

  let maturity_id;

  if (!maturity) {
    maturity_id = 3;
  }

  if (maturity >= 3 && maturity <= 6) {
    maturity_id = 1;
  } else if (maturity >= 7 && maturity <= 13) {
    maturity_id = 2;
  } else if (maturity >= 14 && maturity <= 20) {
    maturity_id = 3;
  } else if (maturity >= 21 && maturity <= 29) {
    maturity_id = 4;
  } else if (maturity >= 30 && maturity <= 60) {
    maturity_id = 5;
  } else if (maturity >= 61 && maturity <= 90) {
    maturity_id = 6;
  } else if (maturity >= 91 && maturity <= 121) {
    maturity_id = 7;
  } else if (maturity >= 122 && maturity <= 151) {
    maturity_id = 8;
  } else if (maturity >= 152 && maturity <= 182) {
    maturity_id = 9;
  } else if (maturity >= 183 && maturity <= 212) {
    maturity_id = 10;
  } else if (maturity >= 213 && maturity <= 242) {
    maturity_id = 11;
  } else if (maturity >= 243 && maturity <= 273) {
    maturity_id = 12;
  } else if (maturity >= 274 && maturity <= 303) {
    maturity_id = 13;
  } else if (maturity >= 304 && maturity <= 334) {
    maturity_id = 14;
  } else if (maturity >= 335 && maturity <= 364) {
    maturity_id = 15;
  } else if (maturity >= 365 && maturity <= 547) {
    maturity_id = 16;
  } else if (maturity >= 548 && maturity <= 1094) {
    maturity_id = 17;
  } else if (maturity >= 1095) {
    maturity_id = 18;
  }
  // query

  const query = `SELECT rate FROM model
    WHERE amount = ${amount_range} 
    and currency = ${currency_id} 
    and early_return_policy = ${early_refund_id}
    and order_of_payment = ${payment_period_id}
    and maturity = ${maturity_id}
    and deposit_type = ${deposite_type}`;

  connection.query(query, function(error, results, fields) {
    // handle no data for inputs
    if (error) {
      return res.json("3.62");
    } else {
      // handle no data for inputs
      if (!results[0]) {
        return res.json("3.62");
      }
    const rate = (results[0].rate * 100).toFixed(2);

    return res.json(parseFloat(rate));
    }
  });
});
