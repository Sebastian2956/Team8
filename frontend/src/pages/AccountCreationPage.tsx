import CreateAccount from "../components/CreateAccount.tsx";
import background from "../assets/photos/fuji.jpg";

const AccountCreationPage = () => {
    return(
        <div id="AccountCreationPage" style={{backgroundImage: `url(${background})`}}>
            <div id="formbox">
                <h1>Create an account.</h1>
                <CreateAccount />
            </div>
        </div>
    );
};

export default AccountCreationPage;