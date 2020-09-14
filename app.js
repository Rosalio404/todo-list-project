//Modules
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

//Variables
const app = express();
const port = 3000;
const items = ["Buy food", "Cook food", "Eat food"];
const workItems = [];

//Body-Parser
app.use(bodyParser.urlencoded({extended: true}));

//Express
app.use(express.static("public"));
app.set("view engine", "ejs");

//GET
app.get("/", function(req, res){
	let route = "/";
	const day = date.getDate();
	res.render("list", {listTitle: day, newListItems: items, route: route});
});

app.get("/work", function(req, res){
	let route = "/work";
	res.render("list", {listTitle: "Work", newListItems: workItems, route: route});
});

app.get("/about", function(req, res){
	res.render("about")
});

//POST
app.post("/", function(req, res){
	const item = req.body.newitem;

	if (req.body.list === "Work") {
	workItems.push(item);
	res.redirect("/work");
	} else {
	items.push(item);
	res.redirect("/");
	}
});

//Listen
app.listen(port, function(){
		console.log("Server started on port " + port);
});
