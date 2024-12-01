import { LOCALHOST_PORT } from '../config';
import React, {useState} from 'react';
import updateBudget from './Budget';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './FlightDetails.css';

function FlightDetails(){
    const _td: any = localStorage.getItem('trip_data');
    const td = JSON.parse(_td);
    const tripId: string = td.TripId;

    const [message, setMessage] = useState('');
    const [airline, setAirline] = useState('');

    const [departureTime, setDepartureTime] = useState('');

    const [arrivalTime, setArrivalTime] = useState('');
    const [departureLocation, setDepartureLocation] = useState('');
    const [arrivalLocation, setArrivalLocation] = useState('');
    const [price, setPrice] = useState('');

    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date());



    async function addFlight(event: any): Promise<void>{
        event.preventDefault();
        //input: airline, departureDate, departureTime, arrivalDate, arrivalTime, departureLocation, arrivalLocation, price
        //output: confirmation
        //create object then turn it into json string
        const obj = {tripId, airline, departureDate, departureTime, arrivalDate, arrivalTime, departureLocation, arrivalLocation, price};
        const js = JSON.stringify(obj);
        try{
            const response = await fetch( LOCALHOST_PORT + '/api/addFlight', {
                method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            const txt = await response.text();
            const res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage('API Error: ' + res.error);
            } else {
                setMessage('Flight Added');
                updateBudget(tripId, parseInt(price));
            }
        }catch(error: any){
            alert(error.toString());
        }
    };

    return(
        <div>
            <div id="addFlightBody">
                <input type="text" id="airline" placeholder="Airline"
                    onChange={(e) => setAirline(e.target.value)} />
                <DatePicker selected={departureDate} onChange={(date: any) => setDepartureDate(date)} />
                <input type="text" id="departureTime" placeholder="Departure Time"
                    onChange={(e) => setDepartureTime(e.target.value)} />
                <DatePicker selected={arrivalDate} onChange={(date: any) => setArrivalDate(date)} />
                <input type="text" id="arrivalTime" placeholder="Arrival Time"
                    onChange={(e) => setArrivalTime(e.target.value)} />
                <input type="text" id="departureLocation" placeholder="Departure Location"
                    onChange={(e) => setDepartureLocation(e.target.value)} />
                <input type="text" id="arrivalLocation" placeholder="Arrival Location"
                    onChange={(e) => setArrivalLocation(e.target.value)} />
                <input type="text" id="price" placeholder="Price"
                    onChange={(e) => {
                        const _reduce = 0 - parseInt(e.target.value);
                        const reduce = _reduce.toString();
                        setPrice(reduce)}} />
                <button type="button" id="addFlightButton"
                    onClick={addFlight}> Add Flight</button><br />

            </div>
            <span id="TripAddResult">{message}</span>
        </div>
    );
}

export default FlightDetails;
