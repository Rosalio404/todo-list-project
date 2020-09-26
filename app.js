//Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});


// Schemas
// Define item schema and constructor model
const itemSchema = {
	itemContent: String,
};
const Item = mongoose.model("Item", itemSchema);


// Add item variables, create array, insert array
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


// Define list schema and model
const listSchema= {
	title: String,
	items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

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

app.get("/:listName", function (req, res) {
	const listName = req.params.listName;

	List.findOne({title: listName}, function (err, foundList) {
		if(!err){
			if (!foundList) {
				const newList = new List({
					title: listName,
					items: defaultItems
				});
				newList.save();
				res.redirect("/" + listName);
			} else {
				res.render("list", {listTitle: foundList.title, newListItems: foundList.items});
			}
		} else {
			console.log(err);
		}
	});
});

app.get("/about", function(req, res){
	res.render("about");
});

// POST
app.post("/", function(req, res){
	const itemContent = req.body.newItem;
	const listName = req.body.list;
	const newUserItem = new Item({
		itemContent: itemContent,
	});
	if (listName === "Today") {
	newUserItem.save();
	res.redirect("/");
	} else {
		List.findOne({title: listName}, function (err, foundList) {
			foundList.items.push(newUserItem);
			foundList.save();
			res.redirect("/" + listName);
		});
	}
});

app.post("/delete", function (req, res) {
	const checkedItem = req.body.checkbox;
	const listName = req.body.listTitle;
	console.log(req.body);
	if(listName === "Today") {
		Item.findByIdAndRemove(checkedItem, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Successfully removed item!");
				res.redirect("/" + listName);
			}
		});
	} else {
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function (err, foundList) {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/" + listName);
			}
		});
	}
});

// Listen
app.listen(3000, function() {
	console.log("Server started on port 3000");
});
