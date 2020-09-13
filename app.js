//NPM
const express = require("express");
const bodyParser = require("body-parser");

//Variables
const app = express();
const port = 3000;
var items = ["Buy food", "Cook food", "Eat food"];
		  
//Body-Parser
app.use(bodyParser.urlencoded({extended: true}));

//Express
app.set("view engine", "ejs");

//GET
app.get("/", function(req, res){
	var today = new Date();
	var options = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};
	var day = today.toLocaleDateString("en-US", options);
	res.render("list", {kindOfDay: day, newListItems: items});
});

//POST
app.post("/", function(req, res){
	var newItem = req.body.newitem;
	items.push(newItem)
	res.redirect("/");
})
//Listen
app.listen(port, function(){
		console.log("Server started on port " + port);
});
