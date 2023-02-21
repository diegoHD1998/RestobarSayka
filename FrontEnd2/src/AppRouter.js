import React, {useContext} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { AuthContext } from './auth/authContext';
import Login from './Login'
import App from './App';


const AppRouter = () => {

    const {user} = useContext(AuthContext)
    //const rutasServidor = "Restobar/"
    const rutasServidor = "/"
    

    return (
            <Router>
                <Switch>

                    <Route exact path={rutasServidor + "Login"} component={Login} />

                    <Route path={rutasServidor} render={()=> (user.logged) ? <App/> : <Redirect to='/Login' /> } />

                </Switch>
            </Router>
    );
};

export default AppRouter;