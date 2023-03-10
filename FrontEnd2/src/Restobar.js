import React, { useEffect, useReducer} from 'react';
import AppRouter from './AppRouter';
import { AuthContext } from './auth/authContext';
import { authReducer } from './auth/authReducer';


const init = () => {
    return JSON.parse(localStorage.getItem('user')) || {Logged: false}
    
}

const Restobar = () => {

    const [user, dispatch] = useReducer(authReducer, {}, init)
    
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])


    

    return (
        <AuthContext.Provider value={{user, dispatch}}>
            <AppRouter/>
        </AuthContext.Provider>
        
    );
};

export default Restobar;