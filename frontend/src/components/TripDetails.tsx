import React, {useState} from 'react';
import FindFlights from './FindFlights';
import FlightDetails from './FlightDetails';

import './TripDetails.css'

function TripDetails(){
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
    
    console.log(tripStartDate);

    const addItineraryItem = () => {
        const newItem = prompt('Enter a new itinerary item:');
        if (newItem) {
            setItinerary([...itinerary, newItem])
        }
    };

    function goBack(){
        localStorage.removeItem("trip_data");
        window.location.href = '/trips';

    };

    const toggleSearchFlights = () => {
        if(isFlightsInfOpen){
            setIsFlightsInfOpen(!isFlightsInfOpen);
        }

        setIsFlightsOpen(!isFlightsOpen);
    };

    const toggleFlightInfo = () => {
        if(isFlightsOpen){
            setIsFlightsOpen(!isFlightsOpen);
        }

        saveCookie();
        setIsFlightsInfOpen(!isFlightsInfOpen);
    };

    function findFlights(){
        //save cookie before redirect
        saveCookie();
        window.location.href = '/findFlights'
    }

    function saveCookie(){
        //hold origin, dest, and start date
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() +(minutes*60*1000));
        document.cookie = "origin=TPA"+",destination=" + tripLocation +",startDate=2024-12-12" + ";expires=" +date.toUTCString()
    }

    function getFlights(){
        
    }

    return(
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
                        <button onClick ={findFlights}>Find Flights</button>
                        <h3>Flights:</h3>
                        <div className="trip_section">
                            <div className="flights">
                                <div id="flightsButtons">
                                    <button onClick={toggleSearchFlights}>Find Flights</button>
                                    <p> or </p>
                                    <button onClick={toggleFlightInfo}>Enter Flight Info</button>
                                </div>

                                <div>
                                    {isFlightsOpen && <FindFlights />}
                                    {isFlightsInfOpen && <FlightDetails />}

                                </div>

                                <div>
                                    
                                </div>
                            </div>
                        </div>

                        <h3>Hotels:</h3>
                        <div className="trip_section">
                            <div className="hotels">
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