import { LOCALHOST_PORT } from '../config';
import React, {useState, useEffect} from 'react';


function FindFlights(){
    const [searchResults, setResults] = useState<string[]>([]);
    //vars needed to find a flight (locations must be the 3 letter code)
    var origin = "";
    var iataCityCode = "";
    var iataAirlineCode = "";

    var destination = "";
    var iataDestination = "";

    var startDate = "";
    var returnDate = "";

    
    


    function readCookie(){
        let data = document.cookie;
        console.log(data);
        let splits = data.split(",");
        for(var i = 0; i < splits.length; i++){
            let thisOne = splits[i].trim();
            let tokens = thisOne.split("=");
            if(tokens[0] == "origin"){
                origin = tokens[1];
            }
            else if(tokens[0] == "destination"){
                destination = tokens[1];
            }
            else if(tokens[0] == "startDate"){
                startDate = tokens[1];
            }
            else if(tokens[0] == "returnDate"){
                returnDate = tokens[1];
            }


        }
        console.log(origin, destination, startDate);




    }


    async function getAirport(): Promise<void>{
        //event.preventDefault();
        
        const obj = {cityname: destination};
        const apiUrl = LOCALHOST_PORT + '/api/getNearestAirport/'
        const searchParams = new URL(apiUrl);
        searchParams.search = new URLSearchParams(obj).toString();

        

        try{
            const response = await fetch(searchParams)
            const txt = await response.text();
            const res = JSON.parse(txt);

            
            console.log(res.data[0].iataCode);
            iataDestination = res.data[0].iataCode;
            
            console.log("Airport: " + iataDestination);

        }catch(error:any){
            setResults([error.toString])
        }

 
    }


    /*

    async function findFlight(event: any): Promise<void>{
        event.preventDefault();

        //obj to hold all the data needed to query a flight
        const obj = {origin, destination, startDate};
        const js = JSON.stringify(obj);
        try{
            const response = await fetch(LOCALHOST_PORT + '/api/findFlightsFromToWhereOnDate',{
                method: 'GET', body: js, headers: { 'Content-Type': 'application/json' }
            })
            const txt = await response.text();
            const res = JSON.parse(txt);
            const results = res.results;

            console.log(results);

        }catch(error:any){
            setResults([error.toString])
        }
    }
    */
    useEffect(()=>{
        const fetchData = async() =>{
            readCookie();
            await getAirport();
            if(iataDestination != ""){
                const obj = {
                    origin: "TPA",
                    destination: iataDestination,
                    date: "2024-12-12"

                };
                console.log(obj);
                const apiUrl = LOCALHOST_PORT + '/api/findFlightsFromToWhereOnDate/'
                const searchParams = new URL(apiUrl);
                searchParams.search = new URLSearchParams(obj).toString();
                //console.log(searchParams);

                


                try{
                    const response = await fetch(searchParams);
                    const txt = await response.text();
                    const res = JSON.parse(txt);

                    console.log(res);

                }catch(error:any){
                    setResults([error.toString]);
                    console.log(searchResults);
                }
            }
        }
        
        fetchData();
    }, []);
    
    return(
        <div>
            <h1>test</h1>
        </div>
    )
    //useEffect() to call findFlight on page load

}
export default FindFlights;