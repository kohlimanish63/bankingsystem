const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const ejs = require("ejs")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


mongoose.connect("mongodb+srv://admin-manish:qweasdzxc@cluster0.zl5nb.mongodb.net/customersDB?retryWrites=true", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("you are connected to mongoDB") })
    .catch((err) => { console.log("Something went wrong", err) })

const customerSchema = {
    name: String,
    email: String,
    amount: Number
}

const Customer = mongoose.model("Customer", customerSchema);

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/customers", (req, res) => {

    Customer.find({}, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            res.render("customers", { customers: docs });
        }
    })
})

app.get("/transfer", (req, res) => {

    Customer.find({}, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            res.render("transfer", { customers: docs });
        }
    })

})

app.post("/transfer", (req, res) => {
    console.log(req.body);
    const id = req.body.customer;
    Customer.findOne({ _id: id }, (err, doc) => {
        const prevAmt = doc.amount;
        const newAmt = req.body.amount;
        const updatedAmt = Number(prevAmt) + Number(newAmt);
        console.log(updatedAmt)

        Customer.updateOne({ _id: id }, { amount: updatedAmt }, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("customers")
            }
        })

    })


})

app.get("/customers/:customerId", (req, res) => {
    const id = req.params.customerId;
    Customer.findOne({ _id: id }, (err, doc) => {
        res.render("customer", { customer: doc })
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("server is running on port 3000");
})
