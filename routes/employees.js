var mongo = require('mongodb');
 
var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ratemyride', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'winedb' database");
		db.collection('drivers', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
				populateDrivers();
			}
		});
		db.collection('driverRatings', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'ratings' collection doesn't exist. Creating it with sample data...");
				populateRatings();
			}
		});
	}
});

var populateDrivers = function() {
	var drivers = [
	    {"City":"Bangalore","State":"KA", "SEG1":"01", "SEG2":"MD", "PLATE":"4500", "firstName": "Akhilesh", "lastName": "Rai", "Score": 5,"cellPhone": "+919741224650","Mode":"Auto"},
	    {"City":"Bangalore","State":"KA", "SEG1":"02", "SEG2":"MA", "PLATE":"2500", "firstName": "Shankar", "lastName": "S","Score": 4,"cellPhone": "617-000-0002","Mode":"Auto"},
	    {"City":"Bangalore","State":"KA", "SEG1":"03", "SEG2":"MD", "PLATE":"1234", "firstName": "Anand", "lastName": "Kumar", "Score": 4.5,"cellPhone": "617-000-0001"},
	    {"City":"Bangalore","State":"KA", "SEG1":"04", "SEG2":"MD", "PLATE":"4321", "firstName": "Jai", "lastName": "Tanna","Score": 4.5,"cellPhone": "617-000-0002"},
	    {"City":"Bangalore","State":"KA", "SEG1":"05", "SEG2":"MD", "PLATE":"1920", "firstName": "Hamiz", "Rodrigeese": "King", "Score": 3,"cellPhone": "617-000-0001"},
	    {"City":"Bangalore","State":"KA", "SEG1":"06", "SEG2":"KA", "PLATE":"4500", "firstName": "Ajith", "lastName": "Kumar","Score": 5,"cellPhone": "9845031509"}
	];
 
 
	db.collection('drivers', function(err, collection) {
		collection.insert(drivers, {safe:true}, function(err, result) {});
		});
 
};

var populateRatings = function() {
	var driverRatings = [{"dId":'5',"uId":1,"rating":0}];

 	db.collection('driverRatings', function(err, collection) {
		collection.insert(driverRatings, {safe:true}, function(err, result) {});
		});
 
};

var options = [
    {"City":"Bangalore", "Mode": "Auto", "Option": "Day", "rate": [0, 1.9, 25, 13, 1], "Timing":['0500','2300']}, //Fare array = baseFare, least distance, least fare, per km rate, multiplier
    {"City":"Bangalore", "Mode": "Auto", "Option": "Night", "rate": [0, 1.9, 25, 13, 1.5], "Timing":['2300', '0500']},
    {"City":"Bangalore", "Mode": "Meru", "Option": "Day", "rate": [0, 4, 80, 19.50, 1],"Timing":['0500','0000'], "Convenience":[40,60], "Comment":["Rs. 40 within 35 minutes, Rs. 60 within 24h", "No charge for the first 20min"]},
    {"City":"Bangalore", "Mode": "Meru", "Option": "Night", "rate": [0, 4, 88, 21.45, 1],"Timing":['0000', '0500'], "Convenience":[40,60], "Comment":["Rs. 40 within 35 minutes, Rs. 60 within 24h", "No charge for the first 20min"]},
    {"City":"Bangalore", "Mode": "MegaCabs", "Option": "Day", "rate": [0, 4, 80, 19.50,1], "Timing":['0600','0000'], "Convenience":[35], "Comment":"Flat Rs. 35 per phone booking"},
    {"City":"Bangalore", "Mode": "MegaCabs", "Option": "Night", "rate": [0, 4, 80, 19.50, 1.1],"Timing":['0000','0600'],"Convenience":[35], "Comment":"Flat Rs. 35 per phonebooking"},
    {"City":"Bangalore", "Mode": "Ola", "Option": "Day/Night", "rate": [0, 7.14, 150, 21, 1], "Comment":"No Night Fees or Phone Booking Charges."},
    {"City":"Bangalore", "Mode": "Ola", "Option": "Luxury", "rate": [0, 5, 200, 20, 1], "Comment":"No Night Fees or Phone Booking Charges."},
    {"City":"Bangalore", "Mode": "Uber", "Option": "Uber Black", "rate": [80, 4.4, 200, 18, 1], "Comment":"App only bookings."},
    {"City":"Bangalore", "Mode": "Uber", "Option": "Uber X", "rate": [50, 5, 125, 15, 1], "Comment":"App only bookings."}
];



exports.findAll = function (req, res, next) {
	//NEED TO ADD STATE!
    var State = req.query.State;	
    var SEG1 = req.query.SEG1;
    var SEG2 = req.query.SEG2; 
    var Plate = req.query.Plate;
    var rating = parseInt(req.query.rating);
    var userId = parseInt(req.query.userId);
    var driverId = req.query.driverId;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var newDriver = [];
    	
    if (rating){
    	console.log ("UID DID RatingChange",userId, driverId, rating);
    	addRating (userId, driverId, rating, res);
    }
    else if (firstName||lastName){
    	newDriver[0] = {"City":"Bangalore","State":State, "SEG1":SEG1, "SEG2":SEG2, "PLATE":Plate, "firstName": firstName, "lastName": lastName,"Score": 0,"cellPhone": "9845031509"};
    	addDriver(newDriver, res);
    	
    }
	else {
		console.log(State, SEG1,SEG2, Plate);
	    if (State||SEG1||SEG2||Plate) {
	        //query = {"PLATE":new RegExp('.*'+Plate+'.*'), "SEG1":SEG1, "SEG2":SEG2, "State":State};
	        
	        var driverQuery = {};//{, "SEG1":SEG1, "SEG2":SEG2, "State":State};
	        if (Plate) driverQuery.PLATE = new RegExp('.*'+Plate+'.*');
	        if (SEG1) driverQuery.SEG1 = SEG1;
	        if (SEG2) driverQuery.SEG2 = SEG2;
	        if (State) driverQuery.State = State;
	        
	        
	        db.collection('drivers', function(err, collection) {
				collection.find(driverQuery).toArray(function(err, filteredEmployees) {
					//res.send(items);
			        res.send(filteredEmployees);
				});
			});
	        
	    } 
	    else {
	        res.send({"result":'Sorry no Cookie'});
	    }
	}
	  
};


exports.returnFares = function (req, res, next) {
        res.send(options);
};

function addRating(userId, driverId, rating, res) {
	driverRatings = {"dId":driverId,"uId":userId,"rating":rating};
	db.collection('driverRatings', function(err, collection) {
		collection.update({dId: driverId, uId:userId}, driverRatings, {upsert:true, safe:true}, function(err, result) {
	    // THIS UPDATE ISNT WORKING PROPER!!!
	        if(err) { 
	        	console.log ("Error adding a driver", driverRatings);
	        	//return 'Error in addrating';
	        }
	        else updateRating(userId, driverId, rating, res);
		});
	});
};

function addDriver(newDriver, res) {

	db.collection('drivers', function(err, collection) {
		collection.insert(newDriver[0], {safe:true}, function(err, result) {
	        if(err) { 
	        	console.log ("Error adding a driver", newDriver);
	        	//return 'Error in addrating';
	        }
	        else {
	        	var resultRes = [{"result":'Added'}];
	        	console.log("Resonding to add driver with", result, resultRes);
	        	res.send(newDriver);
	        }
		});
	});
};

function updateRating(userId, driverId, rating, res) {
	var sumRating = 0;
	var numRating = 0;
	var avRating = 0;
	db.collection('driverRatings', function(err, collection) {
		collection.aggregate([{$match:{dId:driverId}},{$group:{_id: "$dId", total:{$sum: "$rating"}, count:{$sum: 1}}}], function(err, aggScore) {
			//res.send(items);
			if(!err) {
				console.log("aggregate scores",aggScore);
				sumRating = aggScore[0].total;
				numRating = aggScore[0].count; 
				avRating = Math.round(sumRating / numRating * 10)/10;
	       		updateScore(userId, driverId, avRating, res);
	       	}
	       	else console.log ("error in update rating", err);

	        
		});
	});
}

function updateScore (userId, driverId, avRating, res) {
    var newRating = [];//[{"rating":"0"}];

	db.collection('drivers', function(err, collection) {
		collection.update({_id: new BSON.ObjectID(driverId)}, {$set:{"Score": avRating}}, {safe:true}, function(err, result) {

			if (!err) console.log('Updated', avRating, driverId, result);
			else console.log('Eror occurred during update',driverId, err);
			console.log ("Returning avRAting from update score", avRating);
			newRating[0] = {"rating":avRating};// [0].rating = addRating (userId, driverId, rating);
    		res.send(newRating);
			
		
		});
	});
}

function writeData(message) {
	var fs = require("fs");
	//fs.writeFile( "testfile.json", JSON.stringify(  ), "utf8", yourCallback );
    fs.writeFile('message.txt', JSON.stringify( message ), function (err) { //JSON.stringify( message )
	      if (err) throw err;
			console.log('It\'s saved! in same location.');
	});

	console.log("called back");
};
exports.writeFile = function (req, res, next) {
	var reqBody = req.body;
	console.log('hi');
	console.log(reqBody.position);
	console.log(reqBody);
	
	var myJson = {
	    key: "myvalue"
	};
	writeData(req.body);
	// And then, to read it...
	//myJson = require("./testfile.json");
	res.send("got it");
};
