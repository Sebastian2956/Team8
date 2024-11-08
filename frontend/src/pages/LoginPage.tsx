import PageTitle from "../components/PageTitle.tsx";
import Login from '../components/Login.tsx';
import ImageCarousel from "../components/ImageCarousel.tsx";

const LoginPage = () => {
    return(
        <div id="LoginPage">
            <ImageCarousel />
            <div id ="login_side">
            <PageTitle/>
            <Login/>
            </div>
        </div>
    );
};

export default LoginPage;