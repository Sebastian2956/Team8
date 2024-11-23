import React, { useState } from 'react';
import { LOCALHOST_PORT } from '../config';

function CreateAccount() {
    // State variables to store form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    // Function to cancel account creation and return to the home page
    function cancelCreation() {
        window.location.href = '/';
    }

    // Function to send data to the registerUser API
    async function createAccount(event: React.FormEvent) {
        event.preventDefault(); // Prevent form submission from reloading the page

        // Prepare the data to send
        const newUser = {
            firstName,
            lastName,
            email,
            userName: loginName,
            password: loginPassword,
        };

        try {
            // Make the API call
            const response = await fetch( LOCALHOST_PORT + '/api/registerUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const result = await response.json();

            // Handle the API response
            if (response.ok) {
                setMessage('Account created successfully!');
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to the login page or home
                }, 2000);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error: any) {
            setMessage(`An error occurred: ${error.toString()}`);
        }
    }

    return (
        <form id="accountCreationForm" onSubmit={createAccount}>
            <input
                type="text"
                id="firstName"
                placeholder="First Name"
                className="textField"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                className="textField"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="text"
                id="email"
                placeholder="Email"
                className="textField"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                id="loginName"
                placeholder="Username"
                className="textField"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
            />
            <input
                type="password"
                id="loginPassword"
                placeholder="Password"
                className="textField"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit" id="createAccountButton" className="bigButton">
                Create Account
            </button>
            <button
                type="button"
                id="cancelButton"
                className="mediumButton"
                onClick={cancelCreation}
            >
                Cancel
            </button>
            {message && <p>{message}</p>} {/* Display feedback to the user */}
        </form>
    );
}

export default CreateAccount;
