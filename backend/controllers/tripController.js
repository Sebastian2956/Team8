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


//add trip
const addTrip = async (req, res, next) =>{
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
};



//search trips
const searchTrips = async (req, res, next) =>{
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
};


// delete trip
const deleteTrip = async (req, res, next) => {
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
};

const updateTrip = async (req, res) => {
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
};

module.exports = {
    addTrip,
    updateTrip,
    deleteTrip,
    searchTrips

}