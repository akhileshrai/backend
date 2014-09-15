//mongod --dbpath=./data --smallfiles
var express = require('express'),
    employees = require('./routes/employees'),
    app = express(),
    json = require('express-json');

app.use(express.static('www'));
//app.use(bodyParser.json());
//app.use(urlencode);

//app.use(express.bodyParser());
//app.use(express.bodyParser());

//[express.json(), express.urlencoded()]

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,accept, content-type");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

app.get('/employees', employees.findAll);
app.all('/watch', employees.writeFile);
app.get('/options', employees.returnFares);


app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});