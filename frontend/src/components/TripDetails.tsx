import React, { useState, useEffect } from "react";
import FindFlights from './FindFlights';
import FlightDetails from './FlightDetails';
import { LOCALHOST_PORT } from '../config';
import './TripDetails.css'

type Flight = {
    _id: string;
    TripId: string;
    Airline: string;
    DepartureDate: string;
    DepartureTime: string;
    ArrivalDate: string;
    ArrivalTime: string;
    DepartureLocation: string;
    ArrivalLocation: string;
    Price: number;
};

type Hotel = {
    _id: string;
    TripId: string;
    Name: string;
    Address: string;
    CheckInDate: string;
    CheckOutDate: string;
    PricePerNight: number;
};


function TripDetails() {
    let _td: any = localStorage.getItem('trip_data');
    let td = JSON.parse(_td);
    let tripId: string = td.TripId;
    let tripName: string = td.TripName;
    let tripStartDate: string = td.StartDate;
    let tripEndDate: string = td.EndDate;
    let tripLocation: string = td.Location;
    let tripDescription: string = td.Description;
    const [tripBudget, setTripBudget] = useState(td.Budget);
    const [itinerary, setItinerary] = useState<string[]>([]);
    const [isFlightsOpen, setIsFlightsOpen] = useState(false);
    const [isFlightsInfOpen, setIsFlightsInfOpen] = useState(false);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);


    console.log(tripStartDate);

    const addItineraryItem = () => {
        const newItem = prompt('Enter a new itinerary item:');
        if (newItem) {
            setItinerary([...itinerary, newItem])
        }
    };

    function goBack() {
        localStorage.removeItem("trip_data");
        window.location.href = '/trips';

    };

    const toggleSearchFlights = () => {
        if (isFlightsInfOpen) {
            setIsFlightsInfOpen(!isFlightsInfOpen);
        }

        setIsFlightsOpen(!isFlightsOpen);
    };

    const toggleFlightInfo = () => {
        if (isFlightsOpen) {
            setIsFlightsOpen(!isFlightsOpen);
        }

        saveCookie();
        setIsFlightsInfOpen(!isFlightsInfOpen);
    };

    function findFlights() {
        //save cookie before redirect
        saveCookie();
        window.location.href = '/findFlights'
    }

    function saveCookie() {
        //hold origin, dest, and start date
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        document.cookie = "origin=TPA" + ",destination=" + tripLocation + ",startDate=2024-12-12" + ";expires=" + date.toUTCString()
    }
    useEffect(() => {
        const _td = localStorage.getItem("trip_data");
        if (_td) {
            const td = JSON.parse(_td);
            const tripId: string = td.TripId;

            const fetchFlights = async () => {
                try {
                    const response = await fetch(LOCALHOST_PORT + '/api/flights?TripId=' + tripId, {
                        method: 'GET', // Explicitly specify the method
                        headers: { 'Content-Type': 'application/json' } // Optional for GET, but consistent
                    });

                    const data = await response.json();
                    console.log("Flight data:", data.flights); // Verify the response structure
                    if (data.flights && data.flights.length > 0) {
                        console.log("Fetched flight data:", data); // Log the entire response
                        setFlights(data.flights);
                    } else {
                        setFlights([]);
                    }
                } catch (error) {
                    console.error("Error fetching flights:", error);
                }
            };

            fetchFlights();
        }
    }, []);


    return (
        <div className="trip_details">
            <button onClick={goBack} className="go_back">
                &larr; Go Back
            </button>

            <header>
                <h1>Your Trip, {tripName}</h1>
            </header>
            <div className="layout">
                <div className="trip_left">
                    <div className="trip_info">
                        <h2>{tripLocation}</h2>
                        <p>
                            {tripStartDate} - {tripEndDate}
                        </p>
                        <h3>Budget: ${tripBudget}</h3>
                        <h3>Flights:</h3>
                        <div className="trip_section">
                            <div className="flights">
                                <div id="flightsButtons">
                                    {/* Show the "Find Flights" button only if no flights are booked */}
                                    {flights.length === 0 && (
                                        <><p><strong>No flights booked. Start your adventure by booking through us!</strong></p>
                                            <br></br>
                                            <button onClick={toggleSearchFlights}>Find Flights</button>
                                        </>
                                    )}
                                </div>

                                <div>
                                    {/* Display flight data if flights are booked */}
                                    {flights.length > 0 && (
                                        <div>
                                            {flights.map((flight) => (
                                                <div key={flight._id}>
                                                    <p><strong>Airline:</strong> {flight.Airline}</p>
                                                    <p><strong>Departure:</strong> {flight.DepartureLocation} at {flight.DepartureTime} on{" "}
                                                        {flight.DepartureDate}</p>
                                                    <p><strong>Arrival:</strong> {flight.ArrivalLocation} at {flight.ArrivalTime} on{" "}
                                                        {flight.ArrivalDate}</p>
                                                    <p><strong>Price:</strong> ${flight.Price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {/* Conditional rendering for existing components */}
                                    {isFlightsOpen && <FindFlights />}
                                    {isFlightsInfOpen && <FlightDetails />}
                                </div>
                            </div>

                        </div>

                        <h3>Hotels:</h3>
                        <div className="trip_section">
                            <div className="hotels">
                                {/* Display flight data if flights are booked */}
                                {hotels.length > 0 ? (
                                    hotels.map((hotel) => (
                                        <div key={hotel._id}>
                                            <p><strong>Name:</strong> {hotel.Name}</p>
                                            <p><strong>Address:</strong> {hotel.Address}</p>
                                            <p><strong>Check-In:</strong> {hotel.CheckInDate}</p>
                                            <p><strong>Check-Out:</strong> {hotel.CheckOutDate}</p>
                                            <p><strong>Price/Night:</strong> ${hotel.PricePerNight}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p><strong>No hotels booked. Explore our options to plan your stay!</strong></p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trip_right">
                    <div className="itinerary_header">
                        <h3>Your Itinerary</h3>
                        <button onClick={addItineraryItem} className="add_button">+</button>
                    </div>

                    <div className="itinerary">
                        {itinerary.map((item, index) => (
                            <div key={index} className="itinerary_item">
                                {item}
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
        /* <div id="budgetCounter">
                 <span id="tripName">Trip: {tripName}</span><br />
                 <span id="startDate">Start Date: {tripStartDate}</span><br />
                 <span id="endDate">End Date: {tripEndDate}</span><br />
                 <span id="location">Location: {tripLocation}</span><br />
                 <span id="description">Description: {tripDescription}</span><br />
                 <span id="budget">Budget: ${tripBudget}</span><br />
                 <input type="submit" id="backButton" className="buttons" value="Go Back"
                     onClick={goBack} />
         </div> */
    );
}

export default TripDetails;