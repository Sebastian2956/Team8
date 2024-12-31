require('dotenv').config({ path: '../.env' });
const { ObjectId } = require('mongodb');
//importing express, cors and body-parser
const bodyParser = require('body-parser'); //parses incoming request bodies in a middleware before your handlers, available under the req.body property
const axios = require('axios')


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

        console.log("returned token", tokenCache.accessToken)
        return tokenCache.accessToken
    } catch (error) {
        console.error('Error fetching token: ' + (error.response?.data || error.message))
        throw new Error('Failed to authenticate with Amadeus API')
    }
}

//add hotel
const addHotel = async (req, res, next) =>{
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
};


//deletes hotels obvi
const deleteHotel = async (req, res, next) => {
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
};

module.exports = {
    addHotel,
    deleteHotel
}