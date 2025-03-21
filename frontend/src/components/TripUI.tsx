import React, { useState, useEffect } from 'react';
import { LOCALHOST_PORT } from '../config';
import './tripUI.css';

function TripUI() {
    const _ud: any = localStorage.getItem('user_data');
    const ud = JSON.parse(_ud);
    const userId: string = ud.id;
    const firstName: string = ud.firstName;
    const lastName: string = ud.lastName;

    const trips = [
        { name: "Tokyo", date: "12/12/25", color: "#e1bee7" },
        { name: "Costa Rica", date: "6/1/26", color: "#ffecb3" },
        { name: "Shanghai", date: "8/4/26", color: "#ef9a9a" },
    ];

    const [message, setMessage] = useState('');
    const [searchResults, setResults] = useState<string[]>([]);
    const [tripList, setTripList] = useState<JSX.Element[]>([]);
    const [search, setSearchValue] = useState('');
    const [trip, setTripNameValue] = useState('');
    const [start, setStartDateValue] = useState('');
    const [end, setEndDateValue] = useState('');
    const [location, setLocationValue] = useState('');
    const [description, setDescriptionValue] = useState('');
    const [budget, setBudgetValue] = useState('');
    const [showAddTripForm, setShowAddTripForm] = useState(false);
    const [editedTripData, setEditedTripData] = useState<any>({});
    const [tripBeingEdited, setTripBeingEdited] = useState<any>(null);

    async function addTrip(event: any): Promise<void> {
        event.preventDefault();
        const obj = { userId, tripName: trip, startDate: start, endDate: end, location, description, budget };
        const js = JSON.stringify(obj);
        try {
            const response = await fetch( LOCALHOST_PORT + '/api/addTrip', {
                method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }
            });
            const txt = await response.text();
            const res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage('API Error: ' + res.error);
            } else {
                setMessage('Trip Added');
            }
        } catch (error: any) {
            setMessage(error.toString());
        }
    };

    async function searchTrip(event: any): Promise<void> {
        event.preventDefault();
        const obj = { userId, search };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch( LOCALHOST_PORT + '/api/searchTrips', {
                method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }
            });
            const txt = await response.text();
            const res = JSON.parse(txt);
            const _results = res.results;

            // Generate buttons for each search result
            /* const resultButtons = _results.map((trip: any, index: number) => (
                <button key={trip._id || index} onClick={() => handleTripClick(trip)}>
                    {trip.Location} - {trip.StartDate}
                </button>
            )); */

            setResults(res.results.map((trip:any) => '${trip.Location} - ${trip.StartDate}'));
            setTripList(res.results);
        } catch (error: any) {
            setResults([error.toString()]);
        }
    };

    // Delete Trip Function
    async function handleDeleteTrip(tripId: string) {
        try {
            const response = await fetch(`${LOCALHOST_PORT}/api/deleteTrip`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId, userId }),
            });
        
            const result = await response.json();
        
            if (result.error) {
            setMessage(`Error deleting trip: ${result.error}`);
            } else {
            setMessage('Trip deleted successfully!');
            // Optionally refresh the trip list
            searchTrip(new Event(''));
            }
        } catch (error) {
            setMessage(`Failed to delete trip: ${error}`);
        }
    }

    // Edit Trip function
    function handleEditTrip(trip: any) {
        if (!trip || !trip._id) {
            setMessage("Invalid trip selected for editing.");
            return;
        }
        console.log(trip);

        setTripBeingEdited(trip); // Set the trip being edited
        /*
        setEditedTripData({
            tripName: trip.tripName,
            startDate: trip.startDate,
            endDate: trip.endDate,
            location: trip.location,
            description: trip.description || "",
            budget: trip.budget
        });
        */
    }

    // Save Edited Trip
    async function saveEditedTrip(event: any) : Promise<void>{
        event.preventDefault();
        console.log("going to database")

        if (!tripBeingEdited) {
            setMessage("No trip selected for editing.");
            return;
        }

        const { tripName, startDate, endDate, location, description, budget } = editedTripData;

        const updateData = {
            TripName: tripName,
            StartDate: startDate,
            EndDate: endDate,
            Location: location,
            Description: description || "",
            budget: parseFloat(budget) || 0,
        };

        const obj = { tripId: tripBeingEdited._id, updateData };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch( LOCALHOST_PORT + '/api/updateTrip', {
                method: 'PUT', body: js, headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();

            if (result.error) {
                setMessage('Error updating trip: ' + result.error);
            } else {
                console.log("success");
                setMessage('Trip updated successfully!');
                setTripBeingEdited(null);  // Reset after saving
                setEditedTripData(null);

                setTripList((prevTripList) => prevTripList.map((trip) => trip === tripBeingEdited._id ? { ...trip, ...updateData } : trip))
                searchTrip(new Event('')); // Refresh trip list
            }
        } catch (error) {
            
            setMessage(`Error occurred: ${error}`);
        }
    }

    function doLogout(event: any) : void{
        event.preventDefault();
        //deletes user data and takes you back to the login page
        localStorage.removeItem("user_data");
        window.location.href = '/';
    };

    function handleTripClick(trip: any) {
        //alert(`Trip clicked: ${trip.TripName}`);

        var tripData = {TripId: trip._id, TripName:trip.TripName, StartDate:trip.StartDate, EndDate:trip.EndDate, Location:trip.Location, Description:trip.Description, Budget:trip.Budget};
        //alert(`Trip data: ${JSON.stringify(tripData)}`);
        localStorage.setItem('trip_data', JSON.stringify(tripData));
        window.location.href = '/thisTrip';
    }

    // Handle input change in the edit form
    function handleEditInputChange(e: any) {
        console.log(e.target.name);
        setEditedTripData({ ...editedTripData, [e.target.name]: e.target.value });
    }

    function handleSearchTextChange(e: any): void {
        setSearchValue(e.target.value);
    }
    function handleTripTextChange(e: any): void {
        setTripNameValue(e.target.value);
    }
    function handleStartTextChange(e: any): void {
        setStartDateValue(e.target.value);
    }
    function handleEndTextChange(e: any): void {
        setEndDateValue(e.target.value);
    }
    function handleLocationTextChange(e: any): void {
        setLocationValue(e.target.value);
    }
    function handleDescriptionTextChange(e: any): void {
        setDescriptionValue(e.target.value);
    }
    function handleBudgetTextChange(e: any): void {
        setBudgetValue(e.target.value);
    }

    useEffect(() =>{
        //event.preventDefault();
        const fetchData = async() =>{
            const obj = { userId, search };
            const js = JSON.stringify(obj);
            try{
                const response = await fetch( LOCALHOST_PORT + '/api/searchTrips', {
                    method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }
                });
                const txt = await response.text();
                const res = JSON.parse(txt);
                const _results = res.results;

                // Generate buttons for each search result
                /* const resultButtons = _results.map((trip: any, index: number) => (
                    <button key={trip._id || index} onClick={() => handleTripClick(trip)}>
                        {trip.Location} - {trip.StartDate}
                    </button>
                )); */
                setTripList(_results || []);
            }catch(error: any) {
                setMessage(error.toString());
            }
        }
        fetchData();
    }, [editedTripData]);


    /*return (
        <div id="tripUIDiv">
            <br />
            Search: <input type="text" id="searchText" placeholder="Trip To Search For"
                onChange={handleSearchTextChange} />
            <button type="button" id="searchTripButton" className="buttons"
                onClick={searchTrip}> Search Trip </button><br />
            <span id="tripSearchResult">{searchResults}</span>
            <div id="tripList">{tripList}</div>
            <br /><br />

            Add: <input type="text" id="tripName" placeholder="Trip Name"
                onChange={handleTripTextChange} />
            <input type="text" id="startDate" placeholder="Start Date"
                onChange={handleStartTextChange} />
            <input type="text" id="endDate" placeholder="End Date"
                onChange={handleEndTextChange} />
            <input type="text" id="location" placeholder="Location"
                onChange={handleLocationTextChange} />
            <input type="text" id="description" placeholder="Description"
                onChange={handleDescriptionTextChange} />
            <input type="text" id="budget" placeholder="Budget $$$"
                onChange={handleBudgetTextChange} />
            <button type="button" id="addTripButton" className="buttons"
                onClick={addTrip}> Add Trip</button><br />
            <span id="TripAddResult">{message}</span>
            
            {/* Right Panel }
            <aside className="right-panel">
                <h2>AI Tools</h2>
            </aside>

            {/* Bottom Section }
            <div className="activities">
                <div className="trip-ideas">
                    <h3>For your Tokyo Trip</h3>
                    <div className="idea-cards">
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                    </div>
                </div>
                <div className="other">
                    <h3>Other</h3>
                </div>
            </div>
            <section className="need-ideas">
                <h2>Need Ideas?</h2>
            </section>
        </div>
    );*/
    return (
        <div className="trip-ui">
          {/* Header */}
          <header className="header">
            <h1>Hello, {firstName} {lastName}</h1>
            <nav>
              <button>Trips</button>
              <button>Find Flights</button>
              {/*<button>Option 2</button>
              <button>Option 3</button>*/}
            </nav>
            <button onClick={doLogout} className="signout">
                &rarr; Sign Out
            </button>
          </header>
    
          {/* Main Section */}
          <main className="main">
            {/* Left Section */}
            <section className="upcoming-trips">
              <div className="trips-header">
                <h2>Upcoming Trips</h2>

                <div className="trip_actions">
                    {/* Search Section */}
                    <div className="search_trip">
                        <label htmlFor="searchText">Search:</label>
                        <input type="text" id="searchText" placeholder="Trip to Search for" onChange={handleSearchTextChange}/>
                        <button type="button" id="searchTripButton" className="buttons"
                        onClick={searchTrip}> Search Trip </button>
                    </div>

                    {/* Add New Trip Button */}
                    <button className="add-trip-button" onClick={() => setShowAddTripForm(!showAddTripForm)}>+ Add new Trip</button>
                </div>
                {/* <div id="tripList">{tripList}</div> */}
              </div>

                {/* Add New Trip Container*/}
                <div className="add-trip-container">
                    {showAddTripForm && (
                            <div className="add-trip-section">
                                <h3>Add New Trip</h3>
                                <form className="add-trip-form" onSubmit={addTrip}>
                                    <input type="text" id="tripName" placeholder="Trip Name"
                                    onChange={handleTripTextChange} />
                                    <input type="text" id="startDate" placeholder="Start Date"
                                    onChange={handleStartTextChange} />
                                    <input type="text" id="endDate" placeholder="End Date"
                                    onChange={handleEndTextChange} />
                                    <input type="text" id="location" placeholder="Location"
                                    onChange={handleLocationTextChange} />
                                    <input type="text" id="description" placeholder="Description"
                                    onChange={handleDescriptionTextChange} />
                                    <input type="text" id="budget" placeholder="Budget $$$"
                                    onChange={handleBudgetTextChange} />

                                    <div className="add-trip-buttons">
                                        <button type="submit" className="add-btn">Add Trip</button>
                                        <button 
                                            type="button" 
                                            className="cancel-btn" 
                                            onClick={() => setShowAddTripForm(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                    {/*<button type="submit">Add Trip</button>*/}
                                </form>
            
                                {/* Feedback Message */}
                                <span id="TripAddResult">{message}</span>
                            </div>
                        )}
                </div>

                <div className="trips-list">
                    {/* {trips.map((trip, index) => (
                    <div
                        key={index}
                        className="trip-card"
                        style={{ backgroundColor: trip.color }}
                    >
                        {trip.name} - {trip.date}
                    </div>
                    ))} */}
                    
                    {tripBeingEdited && (
                        <div className="edit-trip-container">
                            <h3>Edit Trip</h3>
                            <form className="edit-trip-form" onSubmit={saveEditedTrip}>
                                <input
                                    type="text"
                                    name="tripName"
                                    value={editedTripData.tripName || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Trip Name"
                                />
                                <input
                                    type="text"
                                    name="startDate"
                                    value={editedTripData.startDate || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Start Date"
                                />
                                <input
                                    type="text"
                                    name="endDate"
                                    value={editedTripData.endDate || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="End Date"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={editedTripData.location || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Location"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={editedTripData.description || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Description"
                                />
                                <input
                                    type="text"
                                    name="budget"
                                    value={editedTripData.budget || ''}
                                    onChange={handleEditInputChange}
                                    placeholder="Budget"
                                />
                                <div className="edit-trip-buttons">
                                    <button type="submit">Save</button>
                                    <button
                                        type="button"
                                        onClick={() => setTripBeingEdited(null)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {tripList.map((trip: any, index: number) => (
                        <div key={index} className="trip-card" onClick={() => handleTripClick(trip)} style={{cursor: 'pointer'}}>
                            <div className="trip-details">
                                {trip.Location} - {trip.StartDate}
                            </div>
                            <div className="trip-actions">
                                <button className="edit-btn" onClick={(e) => {e.stopPropagation(); handleEditTrip(trip);} } >Edit</button>
                                <button className="delete-btn" onClick={(e) => {e.stopPropagation(); handleDeleteTrip(trip._id);} }>Delete</button>
                            </div>
                        </div>
                    ))}
              </div>
            </section>
    
            {/* Right Panel */}
            <aside className="right-panel">
              <h2>AI Tools</h2>
            </aside>
          </main>
    
          {/* Bottom Section */}
          <div className="activities">
            <div className="trip-ideas">
              <h3>For your Trip</h3>
              <div className="idea-cards">
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
            </div>
            <div className="other">
              <h3>Other</h3>
            </div>
          </div>
    
          <section className="need-ideas">
            <h2>Need Ideas?</h2>
          </section>
        </div>
    );
}

export default TripUI;