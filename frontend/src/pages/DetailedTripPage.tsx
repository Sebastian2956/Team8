import TripDetails from '../components/TripDetails';
import FlightDetails from '../components/FlightDetails';
import HotelDetails from '../components/HotelDetails';

const DetailedTripPage = () => {
    return(
        <div id="detailedTripPage">
            <TripDetails/>
            <FlightDetails/>
            <HotelDetails/>
        </div>
    );
}

export default DetailedTripPage;