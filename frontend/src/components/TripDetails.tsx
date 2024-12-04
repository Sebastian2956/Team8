import React, {useState, useEffect} from 'react';
import FindFlights from './FindFlights';
import FlightDetails from './FlightDetails';

import './TripDetails.css'
import { LOCALHOST_PORT } from '../config';

function TripDetails(){
    const _ud: any = localStorage.getItem('user_data');
    const ud = JSON.parse(_ud);
    const userId: string = ud.id;

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

    const [searchResults, setResults] = useState<string[]>([]);
    const [isFlightsOpen, setIsFlightsOpen] = useState(false);
    const [isFlightsInfOpen, setIsFlightsInfOpen] = useState(false);

    const [flightSelected, setFlightSelected] = useState(false);
    const [flightList, setSavedFlightList] = useState<any>([]);

    const [message, setMessage] = useState('');

    var allSavedFlights: Flight[] = [];

    class Flight {
        public id: string;
        public origin: string;
        public arrival: string;
        public departureTime: string;
        public arrivalTime: string;
        public price: number;
        public stops: number;
        public date: string;
        public airline: string;


        public constructor(id:string, origin: string, arrival: string, departureTime: string, arrivalTime: string, price: number, stops: number, date: string, airline: string) {
            this.id = id;
            this.origin = origin;
            this.arrival = arrival;
            this.arrivalTime = arrivalTime;
            this.departureTime = departureTime;
            this.price = price;
            this.stops = stops;
            this.date = date;
            this.airline = airline;
        }
    }
    
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

    async function getFlights(){
       
        const obj = {  tripId };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch( LOCALHOST_PORT + '/api/searchFlights', {
                method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }
            });
            const txt = await response.text();
            const res = JSON.parse(txt);
            const _results = res.results;
            console.log(_results);

            // Generate buttons for each search result
            setSavedFlights(_results);
           
        } catch (error: any) {
            setResults([error.toString()]);
        }
        
    }
    useEffect(() =>{
        const fetchData = async() =>{
            getFlights();
            setFlightSelected(false);
        }
        fetchData();
    },[flightSelected])

    function handleCallback(childData: boolean){
        setFlightSelected(childData);
        console.log(childData);
        
    };

    function setSavedFlights(data: any){

        for(var i = 0; i < data.length; i++){
            console.log(data[i]);
            let flight = new Flight(data[i]._id,data[i].DepartureLocation, data[i].ArrivalLocation, data[i].DepartureTime, data[i].ArrivalTime, data[i].Price, 0, data[i].DepartureDate, data[i].Airline
            );
            allSavedFlights.push(flight);
        }

        const savedFlightDivs = allSavedFlights.map((flight, index) => {
            return(
                <div key={index} className="SavedFlight" data-key={index}>
                <div className="departureArrival">
                    <ul>
                        <li className="airportName"> {flight.origin}</li>
                        <li>{flight.departureTime}</li>
                    </ul>

                    <ul>
                        <li className="airportName"> {flight.arrival}</li>
                        <li>{flight.arrivalTime}</li>
                    </ul>
                    {
                        flight.stops > 0 ? (<h2 className="stops">{flight.stops} Stops</h2>) : (<h2></h2>)
                    }
                </div>
                <div id="dateAndPrice">
                    <h3>{flight.date}</h3>
                    <h2>${flight.price}</h2>
                    <h2>{flight.airline}</h2>
                </div>
                <button onClick={deleteFlight}>Delete Flight</button>
            </div>
            );
        });

        setSavedFlightList(savedFlightDivs);
    }

    async function deleteFlight(event: any){
        var index = event.target.parentNode.getAttribute("data-key");

        var flightId = allSavedFlights[index].id;
        console.log("deleteing flight");
        const obj = {flightId: flightId};
        const js = JSON.stringify(obj);
        try {
            const response = await fetch( LOCALHOST_PORT + '/api/deleteFlight', {
                method: 'DELETE', body: js, headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();

            if (result.error) {
                setMessage('Error deleting flight: ' + result.error);
            } else {
                
            }
        } catch (error) {
            setMessage(`Error occurred: ${error}`);
        }
        event.target.parentNode.remove();


        
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
                        <h3>Flights:</h3>
                        <div className="trip_section">
                            <div className="flights">
                                <div id="flightsButtons">
                                    <button onClick={toggleSearchFlights}>Find Flights</button>
                                    <p> or </p>
                                    <button onClick={toggleFlightInfo}>Enter Flight Info</button>
                                </div>
                                
                                <div id="savedFlightList">
                                    {flightList}
                                </div>

                                <div>
                                    {isFlightsOpen && <FindFlights parentCallback={handleCallback}/>}
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