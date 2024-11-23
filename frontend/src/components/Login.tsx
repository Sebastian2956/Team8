import React, {useState} from 'react';
import { LOCALHOST_PORT } from '../config';


function Login(){
    //     variable, function
    const [message, setMessage] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');

                    //event is like a button press in browser or a form submission
                                //:void means returns void
    async function doLogin(event:any) : Promise<void>{

        event.preventDefault(); //prevents page refresh after form submission

        const obj = {login:loginName, password:loginPassword};
        const js = JSON.stringify(obj);

        try{
            const response = await fetch( LOCALHOST_PORT + '/api/login',
                {
                    method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
            });
            const res = JSON.parse(await response.text());

            if(res.id <= 0){
                setMessage('User/Password combination incorrect');
            }
            else{
                const user = {firstName:res.firstName, lastName:res.lastName, id:res.id};
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/trips';
            }
        }catch(error:any){
            alert(error.toString());
            return;
        }
    };

    function handleSetLoginName(e: any) : void{
        setLoginName(e.target.value);
        //e is the entire event object and contains all the details about the event that occurred, like type (click, change, submit), mouse/keyboard event, target, etc
        //target gives you the element that triggered the event, with more info like type, id, value, etc
        //value gives you the value of that element
    }

    function handleSetPassword(e: any) : void{
        setPassword(e.target.value);
    }

    return(
        <div id="loginDiv">
            {/* <span id="inner-title">Log In</span><br/> */}
            <div id="loginForm">
                <input type="text" id="loginName" placeholder="Username" className="textField" onChange={handleSetLoginName}/>
                <input type="password" id="loginPassword" placeholder="Password" onChange={handleSetPassword}/>


                <input type="submit" id="loginButton" className="bigButton" value="Login"
                    onClick={doLogin}/>
                <span id="loginResult">{message}</span>
            </div>

        </div>
    );              //notice the onClick attribute uses {} to run function
                    //onChange is an event listener that listens for changes in the input field which is then passed to the functions handleSetLoginName and handleSetPassword
};

export default Login;
