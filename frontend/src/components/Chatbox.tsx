import { useState, useEffect } from "react";
import { LOCALHOST_PORT } from "../config";

function Chatbox(props:any){
    const [state, setState] = useState('');
    const [message, setMessage] = useState('');

    const [query, setQuery] = useState('');

    async function queryAI(prompt:any) : Promise<void>{
        prompt.preventDefault()
        //call API function to send query to Google Gemini
        const obj = {query};
        const js = JSON.stringify(obj);
        console.log(js);

        try{
            const response = await fetch(LOCALHOST_PORT + '/api/ai/queryAI',{
                method: 'POST', body:js, headers:{'Content-Type': 'application/json'}
            });
            const txt = await response.text();
            const res = JSON.parse(txt);
            console.log(res);
            //res.candidates.content.parts.text
            if(res.error.length > 0){
                setMessage('API Error: ' + res.error);
            }else{
                setMessage('AI queried');
            }
            
        }catch(error:any){
            setMessage(error.toString());
        }

    }
    function handleQueryChange(e: any): void{
        setQuery(e.target.value);
    }


    //check for state changes
    return(
        <div className="chatbox">
            <form onSubmit={queryAI}>
                <input type="text"  onChange={handleQueryChange}></input>
            </form>




        </div>
    )
}

export default Chatbox;