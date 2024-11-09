import React, { useState } from 'react';
import FlightDetails from './FlightDetails';
import HotelDetails from './HotelDetails';

const DropdownMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFlightDetails, setShowFlightDetails] = useState(false);
    const [showHotelDetails, setShowHotelDetails] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleShowFlightDetails = () => {
        setShowFlightDetails(true);
        setShowHotelDetails(false); // Hide other form if open
    };

    const handleShowHotelDetails = () => {
        setShowHotelDetails(true);
        setShowFlightDetails(false); // Hide other form if open
    };

    const handleClear = () => {
        setShowFlightDetails(false);
        setShowHotelDetails(false);
        setIsOpen(false); //close dropdown
    };

    return (
        <div>
            {/* Main button to open/close the dropdown */}
            <button onClick={toggleDropdown}>Toggle Dropdown</button>

            {/* Dropdown menu items */}
            {isOpen && (
                <div style={{ position: 'absolute', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '4px' }}>
                    <button onClick={handleShowFlightDetails}>Add Flight</button>
                    <button onClick={handleShowHotelDetails}>Add Hotel</button>
                    <button onClick={handleClear}>X</button> {/* Clear button */}
                </div>
            )}

            {/* Conditionally render each component */}
            {showFlightDetails && <FlightDetails />}
            {showHotelDetails && <HotelDetails />}
        </div>
    );
};

export default DropdownMenu;
