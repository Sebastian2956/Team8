//import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router

function CreateAccountButton() {
    const navigate = useNavigate();

    function goToCreateAccount() {
        navigate('/createAccount'); // Navigate without page reload
    }

    return (
        <button
            type="button"
            id="createAccountButton"
            className="mediumButton"
            onClick={goToCreateAccount}
        >
            Create Account
        </button>
    );
}

export default CreateAccountButton;
