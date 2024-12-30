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