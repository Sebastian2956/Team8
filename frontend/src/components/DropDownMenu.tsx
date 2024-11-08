import React, { useState } from 'react';


const DropDownMenu: React.FC = () => {
    // State to toggle the dropdown
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the dropdown visibility
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Define the actions for each button
    const handleAction1 = () => {
        console.log('Action 1 executed');
        // Add your custom logic here
    };

    const handleAction2 = () => {
        console.log('Action 2 executed');
        // Add your custom logic here
    };

    const handleAction3 = () => {
        console.log('Action 3 executed');
        // Add your custom logic here
    };

    return (
        <div>
            {/* Main button to open/close the dropdown */}
            <button onClick={toggleDropdown}>
                Add Flight/Cruise/Hotel
            </button>

            {/* Dropdown menu items, shown only when isOpen is true */}
            {isOpen && (
                <div style={{ position: 'absolute', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '4px' }}>
                    <button onClick={handleAction1}>Action 1</button>
                    <button onClick={handleAction2}>Action 2</button>
                    <button onClick={handleAction3}>Action 3</button>
                </div>
            )}
        </div>
    );
};

export default DropDownMenu;
