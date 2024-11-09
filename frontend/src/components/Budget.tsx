import React, { useState } from 'react';
import FlightDetails from './FlightDetails';

const DropdownMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFlightDetails, setShowFlightDetails] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    // Function to handle showing the FlightDetails component
    const handleShowFlightDetails = () => {
        setShowFlightDetails(true);
        setIsOpen(false); // Close the dropdown after selecting
    };

    return (
        <div>
            {/* Main button to open/close the dropdown */}
            <button onClick={toggleDropdown}>Toggle Dropdown</button>

            {/* Dropdown menu items */}
            {isOpen && (
                <div style={{ position: 'absolute', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '4px' }}>
                    <button onClick={handleShowFlightDetails}><FlightDetails /></button>
                    {/* Other buttons can go here */}
                </div>
            )}

            {/* Conditionally render FlightDetails form */}
            {showFlightDetails && <FlightDetails />}
        </div>
    );
};

export default DropdownMenu;
