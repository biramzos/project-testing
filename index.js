const express = require("express");
const bodyParser = require("body-parser");
let cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.json("application/json"));
app.use(cookieParser());
const Service = require("./Service");
const service = new Service();

app.post("/api/v1/register", function(req, res){
    let name = req.body.name;
    res.cookie("username", name, {maxAge: 100000});
    console.log(`User is saved!(${name})`);
    res.send({name});
});

app.get("/api/v1/login", function(req, res){
    let { username } = req.cookies;
    console.log(`User is log in!(${username})`);
    res.send({username});
});

app.post("/api/v1/send", async function(req, res, next){
    let { username } = req.cookies;
    const message = req.body.message;
    const time = new Date();
    await service.send(username, message);
    res.send({username, message, time});
});

app.listen(3000, () => {
   console.log("Server is started!");
});
