import { LOCALHOST_PORT } from '../config';
import React, {useState, useEffect} from 'react';


function FindFlights(){
    const [searchResults, setResults] = useState<string[]>([]);
    //vars needed to find a flight (locations must be the 3 letter code)
    
    const [flightList, setFlightList] = useState<JSX.Element[]>([]);
    
    var origin = "";
   
    var destination = "";
    var iataDestination = "";

    var startDate = "";
    var returnDate = "";

    var allFlights: Flight[] = [];

    class Flight{
        public origin: string;
        public arrival: string;
        public departureTime: string;
        public price: number;


        public constructor(origin:string, arrival:string, departureTime:string, price: number){
            this.origin = origin;
            this.arrival = arrival;
            this.departureTime = departureTime;
            this.price = price;
        }
       
    }
    function setFlights(data: any){
        for(var i = 0; i < 5; i++){
            var origin = data.data[i].itineraries[0].segments[0].departure.iataCode;
            console.log("origin: " + origin);

            var arrival = data.data[i].itineraries[0].segments[1].arrival.iataCode;
            console.log("arrival: " + arrival);

            var departureString = data.data[i].itineraries[0].segments[0].departure.at;
            let departureTime = departureString.split("T");

            var cost = data.data[i].price.grandTotal;


            var newFlight = new Flight(origin, arrival, departureTime[1], cost);
            allFlights.push(newFlight);
            console.log(newFlight);
        }

        const flightDivs = allFlights.map((flight, index: number) =>(
            <div key ={index}>
                <ul>
                    <li>{flight.origin}</li>
                    <li>{flight.departureTime}</li>
                    
                </ul>
                <h2>{flight.price}</h2>
            </div>
        ));

        setFlightList(flightDivs);

    }
    
    


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
            
            //console.log("Airport: " + iataDestination);

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
                
                const apiUrl = LOCALHOST_PORT + '/api/findFlightsFromToWhereOnDate/'
                const searchParams = new URL(apiUrl);
                searchParams.search = new URLSearchParams(obj).toString();
                //console.log(searchParams);

                


                try{
                    const response = await fetch(searchParams);
                    const txt = await response.text();
                    const res = JSON.parse(txt);

                    console.log(res);
                    //function to store flights into array
                    setFlights(res);

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
            <h1>Flights:</h1>
            <div className="flightDetails">
                {flightList}

            </div>
        </div>
    )
    //useEffect() to call findFlight on page load

}
export default FindFlights;