const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const queryLangApi = require("./src/api/google-natural-language.js").default;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
 console.log("received get request");
 res.send("Hello World!");
});

app.post("/", async (req, res) => {
 console.log("received post request", req.body);
 const text = JSON.parse(Object.keys(req.body)[0]).text;
 console.log("text : ", text);
 const r = await queryLangApi(text);
 res.json(r);
});

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`);
});

queryLangApi("I want a ham and cheese sandwich");
