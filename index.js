const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const queryLangApi = require("./app.js").default;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
 console.log("received get request");
 res.send("Hello World!");
});

app.post("/", async (req, res) => {
 console.log("receive post request", req.body);
 const r = await queryLangApi(req.body.text);
 res.json(r);
});

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`);
});

queryLangApi("I want a ham and cheese sandwich");
