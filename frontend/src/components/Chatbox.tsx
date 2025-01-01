import { useState, useEffect } from "react";
import { LOCALHOST_PORT } from "../config";

function Chatbox(props:any){
    const [state, setState] = useState('');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState<any[]>([]);

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
            await setMessage(message => res.candidates[0].content.parts[0].text);
            console.log(res.candidates[0].content.parts[0].text)
            console.log(message);
            
            //calls function to append message to chatbox
            
            
        }catch(error:any){
            setMessage(error.toString());
        }

    }


    function addAIResponse(){
        
        setMessageList([
            ...messageList,
            {message: message}]); 

        

    }

    function handleQueryChange(e: any): void{
        setQuery(e.target.value);
    }

    useEffect(() =>{
        addAIResponse();
    },[message]);
    


    //check for state changes
    return(
        <div className="chatbox">
            <form onSubmit={(e) =>{
                queryAI(e)
            }}>
                {
                    messageList.map((message, index: number) =>(
                        <p key={index} className="ai-message">{message.message}</p>
                    ))
                }
                <input type="text"  onChange={handleQueryChange}></input>
            </form>




        </div>
    )
}

export default Chatbox;