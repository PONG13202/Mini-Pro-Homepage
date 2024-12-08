import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${config.apiPath}/user/signInHomepage`, {
        user: username,
        pass: password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        Swal.fire({
          title: 'Login Successful',
          text: 'Welcome to the system!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/', { replace: true });
        });
      } else {
        Swal.fire({
          title: 'Access Denied',
          text: 'Only admin users can log in.',
          icon: 'warning',
        });
      }
    } catch (e) {
      const errorMessage = e.response ? e.response.data.message : 'An unexpected error occurred. Please try again later.';
      Swal.fire({
          title: e.response && e.response.status === 401 ? 'Sign In' : 'Error',
          text: errorMessage,
          icon: e.response && e.response.status === 401 ? 'warning' : 'error',
      });
  }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${config.apiPath}/user/googleSignIn`, {
        token: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        Swal.fire({
          title: 'Login Successful',
          text: 'Welcome to the system!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/', { replace: true });
        });
      }
    } catch (e) {
      Swal.fire({
        title: 'Google Login Failed',
        text: e.message,
        icon: 'error',
      });
    }
  };

  const handleGoogleLoginFailure = () => {
    Swal.fire({
      title: 'Google Login Failed',
      text: 'Please try again.',
      icon: 'error',
    });
  };

  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="card card-outline card-primary">
            <div className="card-header text-center">
              <h1><b>Welcome</b> to the Homepage</h1>
            </div>

            <div className="col-2">
            <button 
        className="btn btn-primary btn-block" 
        onClick={() => window.location.href = '/'}
    >
        กลับไปหน้าหลัก
    </button>
    </div>

            <div className="card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <div>
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-label="Username"
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user"></span>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                    <div className="icheck-primary">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">Remember Me</label>
                    </div>
                  </div>
                  <div className="col-4">
                    <button className="btn btn-primary btn-block" onClick={handleSignIn}>
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
              <div className="social-auth-links text-center mt-2 mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  prompt="select_account" 
                />
              </div>

              <p className="mb-0">
                <a href="/Register" className="text-center">Register a new membership</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
