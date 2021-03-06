import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Private from './core/Private';
import PrivateRoute from './auth/PrivateRoute';
import Admin from './core/Admin';
import AdminRoute from './auth/AdminRoute';
import Forgot from './auth/Forgot';
import Reset from './auth/Reset';


const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/signin' component={Signin} />
                <Route path="/auth/activate/:token" exact component={Activate} />
                <PrivateRoute path='/private' exact component={Private} />
                <AdminRoute path='/admin' exact component={Admin} />
                <Route path='/auth/password/forgot' exact component={Forgot} />
                <Route path='/auth/password/reset/:token' exact component={Reset} />
            </Switch>
        </Router>
    )
}

export default Routes;
