import React, { useState } from 'react';
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
            const resultButtons = _results.map((trip: any, index: number) => (
                <button key={trip._id || index} onClick={() => handleTripClick(trip)}>
                    {trip.TripName}
                </button>
            ));

            setResults(['Trips have been retrieved']);
            setTripList(resultButtons);
        } catch (error: any) {
            setResults([error.toString()]);
        }
    };

    function handleTripClick(trip: any) {
        alert(`Trip clicked: ${trip.TripName}`);

        var tripData = {TripId: trip._id, TripName:trip.TripName, StartDate:trip.StartDate, EndDate:trip.EndDate, Location:trip.Location, Description:trip.Description, Budget:trip.Budget};
        alert(`Trip data: ${JSON.stringify(tripData)}`);
        localStorage.setItem('trip_data', JSON.stringify(tripData));
        window.location.href = '/thisTrip';
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
            <h1>Hello, {firstName}</h1>
            <nav>
              <button>Trips</button>
              <button>Find Flights</button>
              <button>Option 2</button>
              <button>Option 3</button>
            </nav>
            <a href="#signout" className="signout">
              Sign out
            </a>
          </header>
    
          {/* Main Section */}
          <main className="main">
            {/* Left Section */}
            <section className="upcoming-trips">
              <div className="trips-header">
                <h2>Upcoming Trips</h2>
                <button className="add-trip-button">+ Add new Trip</button>
              </div>
              <div className="trips-list">
                {trips.map((trip, index) => (
                  <div
                    key={index}
                    className="trip-card"
                    style={{ backgroundColor: trip.color }}
                  >
                    {trip.name} - {trip.date}
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
    );
}

export default TripUI;
