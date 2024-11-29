//import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router

function CreateAccountButton() {
    const navigate = useNavigate();

    function goToCreateAccount() {
        navigate('/createAccount'); // Navigate without page reload
    }

    return (
        <button type="button" id="createAccountButton" className="button" onClick={goToCreateAccount}>
            Create an account
        </button>
    );
}

export default CreateAccountButton;
