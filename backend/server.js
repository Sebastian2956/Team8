require('dotenv').config({ path: '../.env' });

//importing express, cors and body-parser
const express = require('express'); //framework for server
const cors = require('cors'); //Cross-Origin Resource Sharing, allows/restricts resources from being accessed by clients from different origins
const bodyParser = require('body-parser'); //parses incoming request bodies in a middleware before your handlers, available under the req.body property


//mongodb stuff
const MongoClient = require('mongodb').MongoClient;
                                    //password                                    //database name
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();
const app = express();
app.use(cors());
app.use(bodyParser.json());

//req represents incoming request from client
//res represents server's response to client
//next is a callback function that passes control to next middleware function
    //callback function allow for async operations. Pass a callback function as argument to main function and is executed after the completion of the main function
app.use((req,res,next) => {
    //set http headers

    //enables CORS, allows requests from any website to this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    //specifies the headers the client may include in requests
    //Origin is a request header that specifies the URL of the page from which the request is initiated
    //X-Requested-With identifies async requests 
    //Content-Type specifies media type for request ie application/json
    //Accept specifies media type for response
    //Authorization is a request header that contains the credentials to authenticate a user
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

//api endpoints       
//login               need async to use await
app.post('/api/login', async (req, res, next) =>{
    //incoming: login, password
    //outgoing: id, firstName, lastName, error
    var error = '';

    const {login, password} = req.body;

    const db = client.db();
    const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
    var id = -1;
    var fn = '';
    var ln = '';

    //results is an array of results of Users found with matching login and password
    if(results.length > 0){
        id = results[0]._id;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }
    var ret = {id:id, firstName:fn, lastName:ln, error:''};
    res.status(200).json(ret);
});

//register user
app.post('/api/registerUser', async (req, res, next) =>{
    //incoming: userId, firstName, lastName, userName, password
    //outgoing: error
    var error = '';
    const {firstName, lastName, userName, password} = req.body;
    const newUser = {FirstName:firstName, LastName:lastName, Login:userName, Password:password};

    try{
        const db = client.db();
        const result = await db.collection('Users').insertOne(newUser);
    }catch(e){
        error = e.toString();
    }
    var ret = {newUser, error:error};
    res.status(200).json(ret);
});

//add trip
app.post('/api/addTrip', async (req, res, next) =>{
    //incoming: userId, tripName, startDate, endDate, location, description
    //outgoing: error
    var error = '';
    const {userId, tripName, startDate, endDate, location, description, budget} = req.body;
    const newTrip = {UserId:userId, TripName:tripName, StartDate:startDate, EndDate:endDate, Location:location, Description:description, Budget: budget};

    try{
        const db = client.db();
        const result = await db.collection('Trips').insertOne(newTrip);
    }catch(e){
        error = e.toString();
    }
    var ret = {newTrip, error:error};
    res.status(200).json(ret);
});

//search trips
app.post('/api/searchTrips', async (req, res, next) =>{
    //incoming: userId, search
    //outgoing: results[], error

    var error = '';
    const{userId, search} = req.body;
    var _search = search.trim();
    const db = client.db();
    //search tripName, startDate, endDate, location, description
    const results = await db.collection('Trips').find({
        $and: [
            {"UserId": userId},
            {
                $or: [
                    {"TripName": {$regex: _search, $options: 'i'}},
                    {"StartDate": {$regex: _search, $options: 'i'}},
                    {"EndDate": {$regex: _search, $options: 'i'}},
                    {"Location": {$regex: _search, $options: 'i'}},
                    {"Description": {$regex: _search, $options: 'i'}}
                ]
            }
        ]
    }).toArray();
    var _ret = [];
    for(var i = 0; i < results.length; i++){
        _ret.push(results[i]);
    }
    var ret = {results:_ret, error:error};
    res.status(200).json(ret);
});



app.listen(5000);