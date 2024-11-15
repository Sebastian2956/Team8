import React, {useState} from 'react';
import updateBudget from './Budget';
import { LOCALHOST_PORT } from '../config';

function HotelDetails(){
    const _td: any = localStorage.getItem('trip_data');
    const td = JSON.parse(_td);
    const tripId: string = td.TripId;

    //hotelName, checkInDate, checkOutDate, location, price
    const [message, setMessage] = useState('');
    const [hotel, setHotel] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [hotelLocation, setHotelLocation] = useState('');
    const [price, setPrice] = useState('');


    async function addHotel(event: any): Promise<void>{
        event.preventDefault();
        //output: confirmation
        //create object then turn it into json string
        const obj = {hotel, checkInDate, checkOutDate, location, price};
        const js = JSON.stringify(obj);
        try{
            const response = await fetch( LOCALHOST_PORT + '/api/addHotel', {
                method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            const txt = await response.text();
            const res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage('API Error: ' + res.error);
            } else {
                setMessage('Hotel Added');
                updateBudget(tripId, parseInt(price));
            }
        }catch(error: any){
            alert(error.toString());
        }
    };

    return(
        <div id="hotelDetails">
            <span id="inner-title">Hotels</span><br/>

            Add: <input type="text" id="hotel" placeholder="Hotel"
                onChange={(e) => setHotel(e.target.value)} />
                <input type="text" id="checkInDate" placeholder="Check In"
                onChange={(e) => setCheckInDate(e.target.value)} />
                <input type="text" id="checkOutDate" placeholder="Check Out"
                onChange={(e) => setCheckOutDate(e.target.value)} />
                <input type="text" id="hotelLocation" placeholder="location"
                onChange={(e) => setHotelLocation(e.target.value)} />

            <input type="text" id="price" placeholder="Price"
                onChange={(e) => {
                    const _reduce = 0 - parseInt(e.target.value);
                    const reduce = _reduce.toString();
                    setPrice(reduce)}} />
            <button type="button" id="addHotelButton" className="buttons"
                onClick={addHotel}> Add Hotel</button><br />

            <span id="HotelAddResult">{message}</span>
        </div>
    );
}

export default HotelDetails;
