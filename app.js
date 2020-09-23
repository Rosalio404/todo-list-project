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
// const mongoItem = new Item({
// 	itemContent: "Learn MongoDB",
// 	checkedState: false
// });
// const reactItem = new Item({
// 	itemContent: "Learn React",
// 	checkedState: false
// });
// const jsItem = new Item({
// 	itemContent: "Learn JavaScript",
// 	checkedState: false
// });

// const defaultItems = [mongoItem, reactItem, jsItem];

// Item.insertMany(defaultItems, function (err) {
// 	if (err){
// 		console.log(err)
// 	} else {
// 		console.log("Successfully inserted items!")
// 	}
// });


//Express
app.get("/", function(req, res) {

	// Create array of all items in DB and send to list
	Item.find({}, function (err, foundItems){
		if (err) {
			console.log(err);
		} else {
			res.render("list", {listTitle: "Today", newListItems: foundItems});
		}
	});


});

app.post("/", function(req, res){

	const item = req.body.newItem;

	if (req.body.list === "Work") {
		workItems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
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
