const Insta = require("instamojo-nodejs");
const bodyParser = require("body-parser");
const path = require('path');
const express = require("express");
const { constants } = require("buffer");

const API_KEY = process.env.API_KEY;

const AUTH_KEY = process.env.AUTH_KEY;

Insta.setKeys(API_KEY, AUTH_KEY);

Insta.isSandboxMode(true);


const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/donation", (req, res) => {
    res.render("donation");
});

app.post("/pay", (req, res) => {
    const name=req.body.name;
    const email=req.body.email;
    const amount=req.body.amount;
    
    const data = new Insta.PaymentData();
    
    data.purpose = "BETTER WORLD";
    data.amount = amount;                 
    data.name=name;
    data.email=email;
    data.setRedirectUrl("http://localhost:3000/success");
    data.send_email ="True"   
    Insta.createPayment(data, function(err, response) {
        if (err) {
            return res.redirect("/donation");
        } 
        console.log(response);
        res.send("Please check your email to confirm payment");
    });
});

app.get("/success", (req, res) => {
    res.render("success");
});


app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});