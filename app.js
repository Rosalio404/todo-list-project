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
};
const Item = mongoose.model("Item", itemSchema);


// Add item variables, create array, insert array
//
const welcomeItem = new Item({
	itemContent: "Welcome to your To Do List!",
});
const addItem = new Item({
	itemContent: "Hit the + to add new items",
});
const deleteItem = new Item({
	itemContent: "<== Hit this to delete an item",
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

app.get("/about", function(req, res){
	res.render("about");
});

// POST
app.post("/", function(req, res){
	const itemContent = req.body.newItem;
	const newUserItem = new Item({
		itemContent: itemContent,
	});
	newUserItem.save();

	res.redirect("/");
});

app.post("/delete", function (req, res) {
	const checkedItem = req.body.checkbox;
	Item.findByIdAndRemove(checkedItem, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Sucessfully removed item!");
			res.redirect("/");
		}
	});
});

// Listen
app.listen(3000, function() {
	console.log("Server started on port 3000");
});
