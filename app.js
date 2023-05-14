const express = require("express");
const ccxt = require("ccxt");
const app = express();
const connection = require("./db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/bitcoin-price", async (req, res) => {
  // Fetch Bitcoin price using ccxt library
  try {
    const exchange = new ccxt.kucoin();
    const ticker = await exchange.fetchTicker("BTC/USDT");
    res.json(ticker.last);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

setInterval(async () => {
  try {
    const exchange = new ccxt.kucoin();
    const ticker = await exchange.fetchTicker("BTC/USDT");
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sql = `INSERT INTO prices (symbol, price, timestamp) VALUES ('BTC/USDT', ${ticker.last}, '${timestamp}')`;
    connection.query(sql, (error, results) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Bitcoin price inserted into MySQL database");
      }
    });
  } catch (error) {
    console.error(error);
  }
}, 3000); // Run every 3 seconds (3000 milliseconds)

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

//------------------DB HELP------------------------//
// CREATE DATABASE ccxt_db;

// USE ccxt_db;

// CREATE TABLE prices (
//   id INT NOT NULL AUTO_INCREMENT,
//   symbol VARCHAR(10) NOT NULL,
//   price DECIMAL(18, 8) NOT NULL,
//   timestamp DATETIME NOT NULL,
//   PRIMARY KEY (id)
// );
