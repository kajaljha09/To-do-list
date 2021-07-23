//jshint esversion:6
require("dotenv").config();
const express = require("express"); //this is to require the express as our server
const bodyParser = require("body-parser");  //dyanamically input send 
const mongoose = require("mongoose");
const encrypt =require("mongoose-encryption");
const app = express();

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true }, { useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

app.use(express.urlencoded({ extended: true }));  //this is to use body parser
app.use(express.static("public"));
//this is to use the css file in our websites
app.set("view engine", "ejs");   //it is important to create view file and there we could write all our ejs files
app.get("/", function (request, response) {  
    var today = new Date();   //date is builtin js function to get the date time 
    var daynum = today.getDay();
    var options = { weekday: 'long', day: 'numeric', month: 'long', }; 
    var day = today.toLocaleDateString("en-US", options);
    Item.find({}, function (err, items) {

        response.render("list", {
            nameOfDay: day,
            items: items
        });
    });
});
app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/")

});
app.post("/delete", function (req, res) {
   
    const itemtobedeleted = req.body.checkbox;
    Item.findByIdAndRemove(itemtobedeleted).exec()
        
    res.redirect("/")
     
});
let port = process.env.PORT;
if (port==null || port==""){
    port=3000
}
app.listen(port, function (req, res) {
    console.log("server is working ")
});