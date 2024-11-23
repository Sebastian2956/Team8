import { LOCALHOST_PORT } from '../config';
import React, {useState} from 'react';

function FindFlights(){
    
    //vars needed to find a flight (locations must be the 3 letter code)
    var origin = "";
    var destination = "";
    var startDate = "";
    var returnDate = "";
    


    function readCookie(){
        let data = document.cookie;
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




    }

    async function findFlight(event: any): Promise<void>{
        event.preventDefault();

        //obj to hold all the data needed to query a flight
        const obj = {
            currencyCode: "USD",
            originDestinations: [
                {
                    id: 1,
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDateTimeRange:{
                        date: startDate
                    }
                },
                {
                    id: 2,
                    originLocationCode: destination,
                    destinationLocationCode: origin,
                    departureDateTimeRange:{
                        date: returnDate
                    }
                }



            ]

        }
    }
    readCookie();

    //useEffect() to call findFlight on page load

}