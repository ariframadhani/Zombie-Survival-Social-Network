const express = require('express');
const Database = require('../app/core/Database');
const {Router} = require("./Router");
const port = 5050;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

Database.initSequelize();
app.listen(port, () => {
    console.log(`Apps ready at port ${port}`);
});
exports.app = app;
Router.init();