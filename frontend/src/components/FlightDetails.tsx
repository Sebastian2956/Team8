import React, {useState} from 'react';
import updateBudget from './Budget';

function FlightDetails(){
    let _td: any = localStorage.getItem('trip_data');
    let td = JSON.parse(_td);
    let tripId: string = td.TripId;

    const [message, setMessage] = useState('');
    const [airline, setAirline] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [departureLocation, setDepartureLocation] = useState('');
    const [arrivalLocation, setArrivalLocation] = useState('');
    const [price, setPrice] = useState('');



    async function addFlight(event: any): Promise<void>{
        event.preventDefault();
        //input: airline, departureDate, departureTime, arrivalDate, arrivalTime, departureLocation, arrivalLocation, price
        //output: confirmation
        //create object then turn it into json string
        let obj = {tripId, airline, departureDate, departureTime, arrivalDate, arrivalTime, departureLocation, arrivalLocation, price};
        let js = JSON.stringify(obj);
        try{
            const response = await fetch('http://localhost:5000/api/addFlight', {
                method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            let txt = await response.text();
            let res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage('API Error: ' + res.error);
            } else {
                setMessage('Trip Added');
                updateBudget(tripId, parseInt(price));
            }
        }catch(error: any){
            alert(error.toString());
        }
    };

    return(
        <div id="flightDetails">
            <span id="inner-title">Flights</span><br/>

            Add: <input type="text" id="airline" placeholder="Airline"
                onChange={(e) => setAirline(e.target.value)} />
            <input type="text" id="departureDate" placeholder="Departure Date"
                onChange={(e) => setDepartureDate(e.target.value)} />
            <input type="text" id="departureTime" placeholder="Departure Time"
                onChange={(e) => setDepartureTime(e.target.value)} />
            <input type="text" id="arrivalDate" placeholder="Arrival Date"
                onChange={(e) => setArrivalDate(e.target.value)} />
            <input type="text" id="arrivalTime" placeholder="Arrival Time"
                onChange={(e) => setArrivalTime(e.target.value)} />
            <input type="text" id="departureLocation" placeholder="Departure Location"
                onChange={(e) => setDepartureLocation(e.target.value)} />
            <input type="text" id="arrivalLocation" placeholder="Arrival Location"
                onChange={(e) => setArrivalLocation(e.target.value)} />
            <input type="text" id="price" placeholder="Price"
                onChange={(e) => {
                    let _reduce = 0 - parseInt(e.target.value);
                    let reduce = _reduce.toString();
                    setPrice(reduce)}} />
            <button type="button" id="addFlightButton" className="buttons"
                onClick={addFlight}> Add Flight</button><br />

            <span id="TripAddResult">{message}</span>
        </div>
    );
}

export default FlightDetails;