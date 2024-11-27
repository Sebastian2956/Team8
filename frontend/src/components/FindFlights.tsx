import { LOCALHOST_PORT } from '../config';
import React, {useState, useEffect} from 'react';
import './FindFlights.css';


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
        public arrivalTime: string;
        public price: number;
        public stops: number;


        public constructor(origin:string, arrival:string, departureTime:string, arrivalTime:string, price: number, stops: number){
            this.origin = origin;
            this.arrival = arrival;
            this.arrivalTime = arrivalTime;
            this.departureTime = departureTime;
            this.price = price;
            this.stops = stops;
        }
       
    }
    function setFlights(data: any){
        for(var i = 0; i < 5; i++){
            var stops = 0;
            var segments = data.data[i].itineraries[0].segments.length - 1;
            var origin = data.data[i].itineraries[0].segments[0].departure.iataCode;
            console.log("origin: " + origin);

            var arrival = data.data[i].itineraries[0].segments[segments].arrival.iataCode;
            console.log("arrival: " + arrival);

            var departureString = data.data[i].itineraries[0].segments[0].departure.at;
            let departureTime = departureString.split("T");

            var arrivalString = data.data[i].itineraries[0].segments[segments].arrival.at;
            let arrivalTime = arrivalString.split("T");

            var cost = data.data[i].price.grandTotal;

            if(segments + 1 > 1){
                stops +=  1;
            }
            

            var newFlight = new Flight(origin, arrival, departureTime[1],arrivalTime[1], cost, stops);
            allFlights.push(newFlight);
            console.log(newFlight);
        }

        const flightDivs = allFlights.map((flight, index: number) =>(
            <div key ={index} className="flightCard">
                <div className="departureArrival">
                    <ul>
                        <li className="airportName"> {flight.origin}</li>
                        <li>{flight.departureTime}</li>
                    </ul>
                    {
                        flight.stops > 0 ? (<h2>{flight.stops} Stops</h2>) : (<h2></h2>)
                    }
                    <ul>
                        <li className="airportName"> {flight.arrival}</li>
                        <li>{flight.arrivalTime}</li>
                    </ul>
                </div>
                <h2>${flight.price}</h2>
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