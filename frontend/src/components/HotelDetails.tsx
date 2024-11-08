import React, {useState} from 'react';
import updateBudget from './Budget';

function HotelDetails(){
    let _td: any = localStorage.getItem('trip_data');
    let td = JSON.parse(_td);
    let tripId: string = td.TripId;

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
        let obj = {hotel, checkInDate, checkOutDate, location, price};
        let js = JSON.stringify(obj);
        try{
            const response = await fetch('http://localhost:5000/api/addHotel', {
                method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            let txt = await response.text();
            let res = JSON.parse(txt);
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
                    let _reduce = 0 - parseInt(e.target.value);
                    let reduce = _reduce.toString();
                    setPrice(reduce)}} />
            <button type="button" id="addHotelButton" className="buttons"
                onClick={addHotel}> Add Hotel</button><br />

            <span id="HotelAddResult">{message}</span>
        </div>
    );
}

export default HotelDetails;