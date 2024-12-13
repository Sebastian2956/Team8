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
const getNearestAirport = async (cityname) => {
    try {
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

    } catch (error) {
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

const findFlightsFromToWhere = async (req, res, next) => {
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

}

const getAirport = async (req, res, next) => {
    const { cityname } = req.query;
    if (!cityname) {
        return res.status(400).json({ error: 'Missing required parameter(s)' })
    }
    try {
        const cityData = await getNearestAirport(cityname);
        res.json(cityData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const searchFlights = async (req, res, next) => {
    let error = '';
    const { userId, tripId } = req.body;


    try {
        const db = client.db();
        const results = await db.collection('Flights').find({
            $and: [
                { "TripId": tripId }
            ]
        }).toArray();
        var _ret = [];
        for (var i = 0; i < results.length; i++) {
            _ret.push(results[i]);
        }
        var ret = { results: _ret, error: error };
        res.status(200).json(ret);

    } catch (e) {
        error = e.toString();
    }
}

const addFlight = async (req, res, next) => {
    let error = '';
    const { tripId, airline, departureDate, departureTime, arrivalTime, departureLocation, arrivalLocation, price } = req.body;

    const priceNumber = price !== undefined ? parseFloat(price) : 0.0;
    if (isNaN(priceNumber)) {
        return res.status(400).json({ error: 'Budget must be a valid number' });
    }

    const newFlight = { TripId: tripId, Airline: airline, DepartureDate: departureDate, DepartureTime: departureTime, ArrivalTime: arrivalTime, DepartureLocation: departureLocation, ArrivalLocation: arrivalLocation, Price: priceNumber };

    try {
        const db = client.db();
        const result = await db.collection('Flights').insertOne(newFlight);
    } catch (e) {
        error = e.toString();
    }
    var ret = { newFlight, error: error }
    res.status(200).json(ret);
}



const deleteFlight = async (req, res, next) => {
    const { flightId } = req.body;

    try {
        const db = client.db();
        if (!ObjectId.isValid(flightId)) {
            return res.status(400).json({ error: 'Invalid flightId format' });
        }

        const result = await db.collection('Flights').deleteOne({ _id: new ObjectId(flightId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Flight not found or already deleted' });
        }
        res.status(200).json({ message: 'Flight deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the flight' });
    }
}

module.exports = {
    findFlightsFromToWhere,
    getAirport,
    searchFlights,
    addFlight,
    deleteFlight

}