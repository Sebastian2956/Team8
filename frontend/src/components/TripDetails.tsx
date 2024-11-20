import React, {useState} from 'react';

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
    
    console.log(tripStartDate);


    function goBack(){
        localStorage.removeItem("trip_data");
        window.location.href = '/trips';

    };

    return(
        <div id="budgetCounter">
        <span id="tripName">Trip: {tripName}</span><br/>
        <span id="startDate">Start Date: {tripStartDate}</span><br/>
        <span id="endDate">End Date: {tripEndDate}</span><br/>
        <span id="location">Location: {tripLocation}</span><br/>
        <span id="description">Description: {tripDescription}</span><br/>
        <span id="budget">Budget: ${tripBudget}</span><br/>
        <input type="submit" id="backButton" className="buttons" value="Go Back"
                onClick={goBack}/>
        </div>
    );
}

export default TripDetails;