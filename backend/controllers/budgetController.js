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


//updateBudget
const updateBudget = async (req, res, next) => {
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
}

module.exports = {
    updateBudget
}