import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';



const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/signin' component={Signin} />
                <Route path="/auth/activate/:token" exact component={Activate} />
            </Switch>
        </Router>
    )
}

export default Routes;
