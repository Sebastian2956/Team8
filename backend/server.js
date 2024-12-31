require('dotenv').config({ path: '../.env' });
const { ObjectId } = require('mongodb');
//importing express, cors and body-parser
const express = require('express'); //framework for server
const cors = require('cors'); //Cross-Origin Resource Sharing, allows/restricts resources from being accessed by clients from different origins
const bodyParser = require('body-parser'); //parses incoming request bodies in a middleware before your handlers, available under the req.body property
const axios = require('axios')
const flightRoutes = require('./routes/flights')
const GeminiRoutes = require('./routes/gemini')
const budgetRoutes = require('./routes/budget')
const hotelRoutes = require('./routes/hotel')
const tripRoutes = require('./routes/trip')
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
app.use('/api',flightRoutes);
app.use('/api/ai', GeminiRoutes);
app.use('/api',budgetRoutes)
app.use('/api',hotelRoutes)
app.use('/api',tripRoutes)
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


app.listen(process.env.LOCALHOST_PORT || 3000);