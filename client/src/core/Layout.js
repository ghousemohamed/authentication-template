import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {isAuth, signout } from '../auth/helpers';



const Layout = ({ children, match, history }) => {
    const isActive = path => {
        if (match.path === path) {
            return { color: '#000' };
        } else {
            return { color: '#fff' };
        }
    };

    const nav = () => (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link to="/" className="nav-link" style={isActive('/')}>
                    Home
                </Link>
            </li>
            {!isAuth() ? <li className="nav-item">
                <Link to="/signin" className="nav-link" style={isActive('/signin')}>
                    Signin
                </Link>
            </li>: null}
            {!isAuth() ?<li className="nav-item">
                <Link to="/signup" className="nav-link" style={isActive('/signup')}>
                    Signup
                </Link>
            </li>: null}
            {isAuth() && <li className="nav-item">
                <span className='nav-link' onClick={() => signout(() => {
                    history.push('/')
                })} style={{cursor: 'pointer'}}>SignOut</span>
            </li>}
        </ul>
    );

    return (
        <Fragment>
            {nav()}
            <div className="container">{children}</div>
        </Fragment>
    );
};

export default withRouter(Layout);
