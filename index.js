const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const {refreshAll}=require("./src/createDatabase");
const {router}=require("./src/router");

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./src/connector')
refreshAll();
app.use("",router);







app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;