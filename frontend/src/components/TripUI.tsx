import React, {useState} from 'react';

function TripUI(){
    let _ud: any = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);
    let userId: string = ud.id;
    let firstName: string = ud.firstName;
    let lastName: string = ud.lastName;


    /*startDate
endDate
location
description*/
    const [message,setMessage] = React.useState('');
    const [searchResults,setResults] = React.useState('');
    const [tripList,setTripList] = React.useState('');
    const [search,setSearchValue] = React.useState('');
    const [trip,setTripNameValue] = React.useState('');
    const [start,setStartDateValue] = React.useState('');
    const [end,setEndDateValue] = React.useState('');
    const [location,setLocationValue] = React.useState('');
    const [description,setDescriptionValue] = React.useState('');


    async function addTrip(event: any) : Promise<void>{
        event.preventDefault();
        alert('addTrip()' + trip);
        let obj = {userId: userId, tripName: trip, startDate: start, endDate: end, location: location, description: description};
        let js = JSON.stringify(obj);
        try{
            const response = await fetch('http://localhost:5000/api/addTrip',{
                method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            let txt = await response.text();
            let res = JSON.parse(txt);
            if (res.error.length > 0){
                setMessage('API Error: ' + res.error);
            }
            else{
                setMessage('Trip Added');
            }
        }catch(error: any){
            setMessage(error.toString());
        }
    };

    async function searchTrip(event: any) : Promise<void>{
        event.preventDefault();
        alert('searchTrip()' + search);

        let obj = {userId: userId, search: search};
        let js = JSON.stringify(obj);

        try{
            const response = await fetch('http://localhost:5000/api/searchTrips',{
                method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            let txt = await response.text();
            let res = JSON.parse(txt);
            let _results = res.results;
            let resultText = '';
            for(let i = 0; i < _results.length; i++){
                resultText += _results[i].TripName;
                if (i < _results.length - 1) {
                    resultText += ', ';
                }
            }
            setResults('Trips have been retrieved');
            setTripList(resultText);
            alert(resultText);
        }
        catch(error: any){
            alert(error.toString());
            setResults(error.toString());
        }
    };

    function handleSearchTextChange(e: any) :void{
        setSearchValue(e.target.value);
    }
    function handleTripTextChange(e: any) : void{
        setTripNameValue(e.target.value);
    }
    function handleStartTextChange(e: any) : void{
        setStartDateValue(e.target.value);
    }
    function handleEndTextChange(e: any) : void{
        setEndDateValue(e.target.value);
    }
    function handleLocationTextChange(e: any) : void{
        setLocationValue(e.target.value);
    }
    function handleDescriptionTextChange(e: any) : void{
        setDescriptionValue(e.target.value);
    }

    return(
        <div id="tripUIDiv">
            <br/>
            Search: <input type="text" id="searchText" placeholder="Trip To Search For"
                onChange={handleSearchTextChange}/>
            <button type="button" id ="searchTripButton" className="buttons"
                onClick={searchTrip}> Search Trip </button><br/>
            <span id="tripSearchResult">{searchResults}</span>
            <p id="tripList">{tripList}</p><br/><br/>
            Add: <input type="text" id = "tripName" placeholder="Trip Name"
                onChange={handleTripTextChange}/>

                <input type="text" id = "startDate" placeholder="Start Date"
                onChange={handleStartTextChange}/>
                <input type="text" id = "endDate" placeholder="End Date"
                onChange={handleEndTextChange}/>
                <input type="text" id = "location" placeholder="Location"
                onChange={handleLocationTextChange}/>
                <input type="text" id = "startDate" placeholder="Description"
                onChange={handleDescriptionTextChange}/>



            <button type="button" id="addTripButton" className="buttons"
                onClick={addTrip}> Add Trip</button><br/>
            <span id="TripAddResult">{message}</span>
        </div>
    );
}

export default TripUI;