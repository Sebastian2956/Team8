import React, {useState} from 'react';

function TripUI(){
    const [message,setMessage] = React.useState('');
    const [searchResults,setResults] = React.useState('');
    const [tripList,setTripList] = React.useState('');
    const [search,setSearchValue] = React.useState('');
    const [trip,setTripNameValue] = React.useState('');

    function addTrip(event: any) : void{
        event.preventDefult();
        alert('addTrip()' + trip);
    };

    function searchTrip(event: any) : void{
        event.preventDefult();
        alert('searchTrip()' + search);
    };

    function handleSearchTextChange(e: any) :void{
        setSearchValue(e.target.value);
    }
    
    function handleTripTextChange(e: any) : void{
        setTripNameValue(e.target.value);
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
            Add: <input type="text" id = "tripName" placeholder="Trip To Add"
                onChange={handleTripTextChange}/>
            <button type="button" id="addTripButton" className="buttons"
                onClick={addTrip}> Add Trip</button><br/>
            <span id="TripAddResult">{message}</span>
        </div>
    );
}

export default TripUI;