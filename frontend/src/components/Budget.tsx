import React, {useState} from 'react';

async function updateBudget( tripId: string, amount: number): Promise<void>{
    
    let obj = {tripId, amount};
    let js = JSON.stringify(obj);
    console.log(js);

    try{
        const response = await fetch('http://localhost:5000/api/updateBudget', {
            method: 'POST', body: js, headers: {'Content-Type': 'application/json'}
        });
        let txt = await response.text();
        let res = JSON.parse(txt);
        console.log(res);
        let newBudget = res.newBudget;
        let tripData = localStorage.getItem('trip_data');
        if (tripData) {
            let parsedData = JSON.parse(tripData);

            // Step 2: Update the budget value
            parsedData.Budget = newBudget; 

            // Step 3: Save the updated data back to localStorage
            localStorage.setItem('trip_data', JSON.stringify(parsedData));
            console.log('Budget updated in localStorage:', parsedData.Budget);
        }
    }catch(error: any){
        console.log(error.toString());
    }
}

export default updateBudget;