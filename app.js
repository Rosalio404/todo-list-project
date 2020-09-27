//Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb+srv://admin-rosalio:test123@cluster0.eeqfu.gcp.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true});

// Schemas
// Define item schema and constructor model
const itemSchema = {
	name: String,
};
const Item = mongoose.model("Item", itemSchema);


// Add item variables, create array, insert array
const item1 = new Item({
	name: "Welcome to your To Do List!",
});
const item2 = new Item({
	name: "Hit the + to add new items",
});
const item3 = new Item({
	name: "<== Hit this to delete an item",
});
const defaultItems = [item1, item2, item3];


// Define list schema and model
const listSchema= {
	name: String,
	items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

//Express
// GET
app.get("/", function(req, res) {

	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0) {
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

app.get("/:customListName", function (req, res) {
	const customListName = _.capitalize(req.params.customListName);

	List.findOne({name: customListName}, function (err, foundList) {
		if(!err){
			if (!foundList) {
				// Create a new list
				const list = new List({
					name: customListName,
					items: defaultItems
				});
				list.save();
				res.redirect("/" + customListName);
			} else {
				// Show existing list
				res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
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

	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName,
	});

	if (listName === "Today") {
	item.save();
	res.redirect("/");
	} else {
		List.findOne({name: listName}, function (err, foundList) {
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + listName);
		});
	}
});

app.post("/delete", function (req, res) {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if(listName === "Today") {
		Item.findByIdAndRemove(checkedItemId, function (err) {
			if (!err) {
				console.log("Successfully removed item!");
				res.redirect("/");
			} else {
				console.log(err);
			}
		});
	} else {
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function (err, foundList) {
			if (!err) {
				res.redirect("/" + listName);
			} else {
				console.log(err);
			}
		});
	}
});

// Listen
app.listen(port, function() {
	console.log("Server started on port " + port + "!");
});
