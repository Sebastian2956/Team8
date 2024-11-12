import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'; //this allows for multipage experience in a single page, meaning no refreshing required to go to another page 

import LoginPage from './pages/LoginPage.tsx';
import TripPage from './pages/TripPage.tsx';
import DetailedTripPage from './pages/DetailedTripPage.tsx';
import AccountCreationPage from './pages/AccountCreationPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/trips" element={<TripPage/>}/>
        <Route path="/thisTrip" element={<DetailedTripPage/>}/>
        <Route path="/createAccount" element={<AccountCreationPage/>}/>
      </Routes>
    </Router>
  );
};

export default App
