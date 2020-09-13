//NPM
const express = require("express");
const bodyParser = require("body-parser");

//Variables
const app = express();
const port = 3000;
let items = ["Buy food", "Cook food", "Eat food"];
let workItems = [];

//Body-Parser
app.use(bodyParser.urlencoded({extended: true}));

//Express
app.use(express.static("public"));
app.set("view engine", "ejs");

//GET
app.get("/", function(req, res){
	let today = new Date();
	let options = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};
	let route = "/";
	let day = today.toLocaleDateString("en-US", options);
	res.render("list", {listTitle: day, newListItems: items, route: route});
});

app.get("/work", function(req, res){
	let route = "/work";
	res.render("list", {listTitle: "Work", newListItems: workItems, route: route});
});

//POST
app.post("/", function(req, res){
	let newItem = req.body.newitem;

	if (req.body.list === "Work") {
	workItems.push(newItem);
	res.redirect("/work");
	} else {
	items.push(newItem);
	res.redirect("/");
	}
});

//Listen
app.listen(port, function(){
		console.log("Server started on port " + port);
});
