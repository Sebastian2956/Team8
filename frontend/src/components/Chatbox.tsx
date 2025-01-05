import { useState, useEffect, useRef } from "react";
import { LOCALHOST_PORT } from "../config";
import './tripAI.css';

function Chatbox(props:any){
    
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState<any[]>([]);

    const [query, setQuery] = useState('');
    const container = useRef<HTMLDivElement>(null);

    

    async function queryAI(prompt:any) : Promise<void>{
        prompt.preventDefault()
        //call API function to send query to Google Gemini
        const obj = {query};
        const js = JSON.stringify(obj);
        console.log(js);
        prompt.target.reset();
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
        if(e.key === "Enter"){
            setQuery(e.target.value);
            setMessageList([
                ...messageList, 
                {message: e.target.value}]);
            console.log(messageList)
        }
    }


    const Scroll = () =>{
        const {offsetHeight, scrollHeight, scrollTop} = container.current as HTMLDivElement
        if(scrollHeight <= scrollTop + offsetHeight + 100){
            container.current?.scrollTo(0, scrollHeight);
        }
    }

    useEffect(() =>{
        addAIResponse();
        Scroll()
    },[message]);

    
    


    //check for state changes
    return(
        <>
            <div ref={container}className="chatbox">
                {
                        
                        messageList.map((message, index: number) =>( index != 0 && message.message != "" ?
                            <p key={index} className="ai-message">{message.message}</p>
                            : index > 0 && message.message == "" ?(<p key={index} className="ai-message">Not a travel related prompt!</p>) : (<></>) ))
                }

            </div>
            <form onSubmit={(e) =>{
                    queryAI(e)
                }}>
                    <input type="text"  onKeyDown={handleQueryChange}></input>
            </form>
        </>
    )
}

export default Chatbox;