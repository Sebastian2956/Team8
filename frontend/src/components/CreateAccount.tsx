import React, {useState} from 'react';

function CreateAccount() {
    function cancelCreation(){
        window.location.href = "/";
    }

    function createAccount(){
        alert("not yet added");
    }

    return(
        <form id="accountCreationForm">
            <input type="text" id="firstName" placeholder="First Name" className="textField"/>
            <input type="text" id="lastName" placeholder="Last Name" className="textField"/>
            <input type="text" id="email" placeholder="Email" className="textField"/>
            <input type="text" id="loginName" placeholder="Username" className="textField"/>
            <input type="password" id="loginPassword" placeholder="Password" className="textField"/>
            <button type="button" id="createAccountButton" className="buttons" onClick={createAccount}> Create Account </button>
            <button type="button" id="cancelButton" className="buttons" onClick={cancelCreation}> Cancel </button>
        </form>
    );
}

export default CreateAccount;