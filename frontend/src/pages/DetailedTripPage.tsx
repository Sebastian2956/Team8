import TripDetails from '../components/TripDetails';
import FlightDetails from '../components/FlightDetails';
import HotelDetails from '../components/HotelDetails';
import DropdownMenu from '../components/DropDownMenu';

const DetailedTripPage = () => {
    return(
        <div id="detailedTripPage">
            <TripDetails/>
            <FlightDetails/>
            <HotelDetails/>
            <DropdownMenu/>
        </div>
    );
}

export default DetailedTripPage;