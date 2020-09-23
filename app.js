//Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});


// Define item schema and constructor model
const itemSchema = {
	itemContent: String,
	checkedState: Boolean,
};
const Item = mongoose.model("Item", itemSchema);


// Add item variables, create array, insert array
//
const welcomeItem = new Item({
	itemContent: "Welcome to your To Do List!",
	checkedState: false
});
const addItem = new Item({
	itemContent: "Hit the + to add new items",
	checkedState: false
});
const deleteItem = new Item({
	itemContent: "<== Hit this to delete an item",
	checkedState: false
});
const defaultItems = [welcomeItem, addItem, deleteItem];



//Express
// GET
app.get("/", function(req, res) {

	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0){
			Item.insertMany(defaultItems, function (err) {
				if (err) {
					console.log(err)
				} else {
					console.log("Successfully inserted items!")
				}
			});
			res.redirect("/");
		} else {
			res.render("list", {listTitle: "Today", newListItems: foundItems});
		}
	});
});

// POST
app.post("/", function(req, res){
	const itemContent = req.body.newItem;
	const newUserItem = new Item({
		itemContent: itemContent,
		checkedState: false
	});

	Item.create(newUserItem, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Successfully inserted items!");
		}
	});

	res.redirect("/");
});

app.get("/work", function(req,res){
	res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
	res.render("about");
});

app.listen(3000, function() {
	console.log("Server started on port 3000");
});
