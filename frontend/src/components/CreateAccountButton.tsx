import React, {useState} from 'react';

function CreateAccountButton() {
    function goToCreateAccount() {
        window.location.href = '/createAccount';
    }

    return (
        <button type="button" id="createAccountButton" className="buttons" onClick={goToCreateAccount}> Create Account </button>
    );
}

export default CreateAccountButton;