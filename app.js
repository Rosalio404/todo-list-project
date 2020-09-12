//NPM
const express = require("express");
const bodyParser = require("body-parser");

//Variables
const app = express();
const port = 3000;

//Express
app.set("view engine", "ejs");

//GET
app.get("/", function(req, res){

		var today = new Date();
		var currentDay = today.getDay();
		var day = "";

		switch (currentDay) {
				case 0:
						day = "Sunday";
						break;
				case 1:
						day = "Monday";
						break;
				case 2:
						day = "Tuesday";
						break;
				case 3:
						day = "Wednesday";
						break;
				case 4:
						day = "Thursday";
						break;
				case 5:
						day = "Friday";
						break;
				case 6:
						day = "Saturday";
						break;
				default:
						console.log("Error: currentDay is equal to " + currentDay)
		}
		// if (currentDay === 6 || currentDay === 0) {
		// 		var day = "Weekend";
		// } else {
		// 		var day = "Weekday";
		// }
		res.render("list", {kindOfDay: day});
});

//Listen
app.listen(port, function(){
		console.log("Server started on port " + port);
});
