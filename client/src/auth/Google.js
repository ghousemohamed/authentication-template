import React from "react";
import axios from "axios";
import GoogleLogin from "react-google-login";
import { authenticate, isAuth } from "./helpers";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";

const Google = ({history}) => {
    const responseGoogle = (response) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/google-login`,
            data: {idToken: response.tokenId}
        })
        .then(response => {
            // inform parent component
            authenticate(response, () => {
                isAuth && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
        toast.success(`Hey ${response.data.user.name}, Welcome Back!`);
            })
        })
        .catch(error => {
            console.log('GOOGLE SIGN-IN', error.response);
        })
    }
  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={renderProps => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='btn btn-danger btn-lg btn-block'>
                <i className='fab fa-google pr-2'></i>Login with Google
            </button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default withRouter(Google);
