import React from 'react';
import Header from "./Header.jsx";
import { useAuthContext, AuthContextProvider } from './AuthContext.js';

const Account = () => {
    const { user } = useAuthContext();
    React.useEffect(() => {
        if (user == null) {console.log("Noone here")}
        else {
          console.log("User ID: "+user['uid']);
          console.log(user);
        }
    },[])
    return(
        // <AuthContextProvider>
        <div>
            <Header/>
            <h1 className='header-title'>ACCOUNT</h1>
            <p style={{paddingTop:'1rem', textAlign:'center'}}>{user?`Welcome, ${user.displayName}`:"Sign in in the bar above!"}</p>
        </div>
        // </AuthContextProvider>
    );
};

export default Account; 