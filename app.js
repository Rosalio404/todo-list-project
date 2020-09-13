//NPM
const express = require("express");
const bodyParser = require("body-parser");

//Variables
const app = express();
const port = 3000;
<<<<<<< HEAD
<<<<<<< HEAD
let items = ["Buy food", "Cook food", "Eat food"];
=======
var items = ["Buy food", "Cook food", "Eat food"];
>>>>>>> 4892858... Change HTML list items to part of the items array
=======
var items = ["Buy food", "Cook food", "Eat food"];
>>>>>>> 4892858... Change HTML list items to part of the items array
		  
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
	let day = today.toLocaleDateString("en-US", options);
	res.render("list", {kindOfDay: day, newListItems: items});
});

//POST
app.post("/", function(req, res){
	let newItem = req.body.newitem;
	items.push(newItem)
	res.redirect("/");
})
//Listen
app.listen(port, function(){
		console.log("Server started on port " + port);
});
