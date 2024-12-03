require('dotenv').config({ path: '../.env' });
const { ObjectId } = require('mongodb');
//importing express, cors and body-parser
const express = require('express'); //framework for server
const cors = require('cors'); //Cross-Origin Resource Sharing, allows/restricts resources from being accessed by clients from different origins
const bodyParser = require('body-parser'); //parses incoming request bodies in a middleware before your handlers, available under the req.body property
const axios = require('axios')

let tripId = "0";

//mongodb stuff
const MongoClient = require('mongodb').MongoClient;
                                    //password                                    //database name
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();
const app = express();
app.use(cors());
app.use(bodyParser.json());


let tokenCache = {
  accessToken: null,
  expirationTime: null
}

const getAccessToken = async () => {

  let isTokenExists = tokenCache.accessToken !== null && tokenCache.expirationTime !== null
  let isTokenValid = Date.now() < tokenCache.expirationTime

  const credentials = `grant_type=${encodeURIComponent('client_credentials')}&` +
                      `client_id=${encodeURIComponent(process.env.AMADEUS_CLIENT_ID)}&` +
                      `client_secret=${encodeURIComponent(process.env.AMADEUS_CLIENT_SECRET)}`;

  try {
    console.log(tokenCache.accessToken)
    console.log(tokenCache.expirationTime)
    if (isTokenExists && isTokenValid) {
      console.log("using current token")
      return tokenCache.accessToken
    }

    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', credentials, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
    })

    const { access_token, expires_in } = response.data
    tokenCache.accessToken = access_token;
    tokenCache.expirationTime = Date.now() + expires_in * 1000;

    console.log("returned token" , tokenCache.accessToken)
    return tokenCache.accessToken
  } catch (error) {
    console.error('Error fetching token: ' + (error.response?.data || error.message))
    throw new Error('Failed to authenticate with Amadeus API')
  }
}
const getNearestAirport = async (cityname)=>{
    try{
        const token = await getAccessToken();
        const api_url = 'https://test.api.amadeus.com/v1/reference-data/locations/cities'

        const response = await axios.get(api_url, {
        params: {
            keyword: cityname,
            include: "AIRPORTS"
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
        })
        return response.data;

    }catch (error) {
        console.error('Error fetching airports: ', (error.response?.data || error.message))
        throw new Error('Failed to fetch airports')
      }
}

const findFlightsFromToWhereOnDate = async (origin, destination, date, adults) => {
  try {

    const token = await getAccessToken();
    const api_url = 'https://test.api.amadeus.com/v2/shopping/flight-offers'

    const response = await axios.get(api_url, {
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: 1
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    return response.data;
  } catch (error) {
    console.error('Error fetching flight-offers: ', (error.response?.data || error.message))
    throw new Error('Failed to fetch flight-offers')
  }
}

app.get('/api/findFlightsFromToWhereOnDate', async (req, res, next) => {
  const { origin, destination, date } = req.query
    console.log(origin + destination + date);
  if (!origin || !destination || !date) {
    return res.status(400).json({ error: 'Missing required parameter(s)' })
  }

  try {
    const flightData = await findFlightsFromToWhereOnDate(origin, destination, date)
    res.json(flightData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
app.get('/api/getNearestAirport', async(req,res,next) =>{
    const {cityname} = req.query;
    if(!cityname){
        return res.status(400).json({ error: 'Missing required parameter(s)' })
    }
    try{
        const cityData = await getNearestAirport(cityname);
        res.json(cityData);
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

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
app.post('/api/registerUser', async (req, res, next) => {
    // Incoming: firstName, lastName, userName, password, email
    const { firstName, lastName, userName, password, email } = req.body;

    // Validate input: Ensure all fields are provided
    if (!firstName || !lastName || !userName || !password || !email) {
        return res.status(400).json({ error: 'All fields, including email, are required' });
    }

    // Additional validation: Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const newUser = {
        FirstName: firstName,
        LastName: lastName,
        Login: userName,
        Password: password,
        Email: email
    };

    try {
        const db = client.db();

        // Check for duplicate username
        const existingUser = await db.collection('Users').findOne({ Login: userName });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Check for duplicate email
        const existingEmail = await db.collection('Users').findOne({ Email: email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert the new user
        const result = await db.collection('Users').insertOne(newUser);app.delete('/api/deleteHotel', async (req, res, next) => {
    const { hotelId } = req.body;

    try {
        const db = client.db();


        if (!ObjectId.isValid(hotelId)) {
            return res.status(400).json({ error: 'Invalid hotelId format' });
        }

        const result = await db.collection('Hotels').deleteOne({ _id: new ObjectId(hotelId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Hotel not found or already deleted' });
        }

        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the hotel' });
    }
});
        res.status(200).json({ success: true, user: newUser });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

//add trip
app.post('/api/addTrip', async (req, res, next) =>{
    //incoming: userId, tripName, startDate, endDate, location, description
    //outgoing: error
    var error = '';
    const {userId, tripName, startDate, endDate, location, description, budget} = req.body;

    // Convert budget to a number (float) if it exists
    const budgetNumber = budget !== undefined ? parseFloat(budget) : 0.0;
    if (isNaN(budgetNumber)) {
        return res.status(400).json({ error: 'Budget must be a valid number' });
    }

    const newTrip = {UserId:userId, TripName:tripName, StartDate:startDate, EndDate:endDate, Location:location, Description:description, Budget: budgetNumber};

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


//add Flight
app.post('/api/addFlight', async (req, res, next) =>{
    let error = '';
    const {tripId, airline, departureDate, departureTime, arrivalTime, departureLocation, arrivalLocation, price} = req.body;

    const priceNumber = price !== undefined ? parseFloat(price) : 0.0;
    if (isNaN(priceNumber)) {
        return res.status(400).json({ error: 'Budget must be a valid number' });
    }

    const newFlight = {TripId:tripId, Airline:airline, DepartureDate:departureDate, DepartureTime:departureTime, ArrivalTime:arrivalTime, DepartureLocation:departureLocation, ArrivalLocation:arrivalLocation, Price:priceNumber};

    try{
        const db = client.db();
        const result = await db.collection('Flights').insertOne(newFlight);
    }catch(e){
        error  = e.toString();
    }
    var ret = {newFlight, error: error}
    res.status(200).json(ret);
});

//search Flight
app.post('/api/searchFlights', async(req, res, next) =>{
    let error = '';
    const {userId, tripId} = req.body;
    

    try{
        const db = client.db();
        const results = await db.collection('Flights').find({
            $and: [
                {"TripId": tripId}
            ]
        }).toArray();
        var _ret = [];
        for(var i = 0; i < results.length; i++){
            _ret.push(results[i]);
        }
        var ret = {results:_ret, error:error};
        res.status(200).json(ret);
       
    }catch(e){
        error  = e.toString();
    }
    
})

//updateBudget
app.post('/api/updateBudget', async (req, res, next) => {
    const {tripId, amount} = req.body;
    const amountNumber = parseFloat(amount);

    try {
        const db = client.db();

        // Ensure tripId is valid and convert it
        if (!ObjectId.isValid(tripId)) {
            return res.status(400).send({ success: false, error: 'Invalid tripId format' });
        }

        // Fetch current budget
        const trip = await db.collection('Trips').findOne({ _id: new ObjectId(tripId) });
        if (!trip) {
            return res.status(404).send({ success: false, error: 'Trip not found' });
        }

        // Parse the current budget as a number and calculate new budget
        const currentBudget = parseFloat(trip.Budget);
        console.log("Current Budget:", currentBudget);
        if (isNaN(currentBudget)) {
            return res.status(500).send({ success: false, error: 'Current budget is not a valid number' });
        }

        const newBudget = (currentBudget + amountNumber).toString();
        console.log("New Budget:", newBudget);


        const result = await db.collection('Trips').updateOne(
            { _id: new ObjectId(tripId) },
            { $set: { Budget: newBudget } }
        );

        console.log("Modified Count:", result.modifiedCount);
        if (result.modifiedCount === 0) {
            return res.status(404).send({ success: false, error: 'Budget not updated' });

        }
        res.status(200).send({ success: true, newBudget });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

//add hotel
app.post('/api/addHotel', async (req, res, next) =>{
    let error = '';
    const {tripId, hotel, checkIn, checkOut, location, price} = req.body;

    const priceNumber = price !== undefined ? parseFloat(price) : 0.0;
    if (isNaN(priceNumber)) {
        return res.status(400).json({ error: 'Budget must be a valid number' });
    }

    const newHotel = {TripId:tripId, Hotel:hotel, CheckIn:checkIn, CheckOut:checkOut, Location:location, Price:priceNumber};

    try{
        const db = client.db();
        const result = await db.collection('Hotels').insertOne(newHotel);
    }catch(e){
        error  = e.toString();
    }
    var ret = {newHotel, error: error}
    res.status(200).json(ret);
});

// delete trip
app.delete('/api/deleteTrip', async (req, res, next) => {
    const { tripId } = req.body;

    try {
        const db = client.db();

        // Ensure tripId is valid and convert it to ObjectId
        if (!ObjectId.isValid(tripId)) {app.delete('/api/deleteHotel', async (req, res, next) => {
    const { hotelId } = req.body;

    try {
        const db = client.db();


        if (!ObjectId.isValid(hotelId)) {
            return res.status(400).json({ error: 'Invalid hotelId format' });
        }

        const result = await db.collection('Hotels').deleteOne({ _id: new ObjectId(hotelId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Hotel not found or already deleted' });
        }

        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the hotel' });
    }
});
            return res.status(400).json({ error: 'Invalid tripId format' });
        }

        const result = await db.collection('Trips').deleteOne({ _id: new ObjectId(tripId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Trip not found or already deleted' });
        }

        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the trip' });
    }
});

//deletes hotels obvi
app.delete('/api/deleteHotel', async (req, res, next) => {
    const { hotelId } = req.body;

    try {
        const db = client.db();


        if (!ObjectId.isValid(hotelId)) {
            return res.status(400).json({ error: 'Invalid hotelId format' });
        }

        const result = await db.collection('Hotels').deleteOne({ _id: new ObjectId(hotelId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Hotel not found or already deleted' });
        }

        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the hotel' });
    }
});

app.put('/api/updateTrip', async (req, res) => {
    const { tripId, updateData } = req.body;

    try {
        const db = client.db();

        // Validate tripId
        if (!ObjectId.isValid(tripId)) {
            return res.status(400).json({ error: 'Invalid tripId format' });
        }

        // Perform the update
        const result = await db.collection('Trips').updateOne(
            { _id: new ObjectId(tripId) }, // Match the trip by ID
            { $set: updateData }           // Update fields in updateData
        );

        // Handle cases where no document is updated
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.status(200).json({ message: 'Trip updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the trip' });
    }
});

app.listen(process.env.LOCALHOST_PORT || 3000);
