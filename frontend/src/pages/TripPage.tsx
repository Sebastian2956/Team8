import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import TripUI from '../components/TripUI';

const TripPage = () => {
    return(
        <div>
            <PageTitle/>
            <LoggedInName/>
            <TripUI/>
        </div>
    );
}

export default TripPage;