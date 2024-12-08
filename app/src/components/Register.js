import React, { useState, } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({
        User_Name: '',
        First_Name: '',
        Last_Name: '',
        Password: ''
    });

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post(`${config.apiPath}/user/register`, user);
            Swal.fire({
                title: 'Registration Successful',
                text: response.data.message,
                icon: 'success',
            }).then(() => {
                
                navigate('/login'); 
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response ? error.response.data.message : 'Registration failed',
                icon: 'error',
            });
        }
    };

    return (
        <div className="hold-transition register-page">
            <div className="register-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <a href="/" className="h1"><b>Admin</b>LTE</a>
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Register a new membership</p>
                        <form onSubmit={handleRegister}>
                            <div className="input-group mb-3">
                                <input
                                    className="form-control"
                                    placeholder="Username"
                                    onChange={e => setUser({ ...user, User_Name: e.target.value })}
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
                                    className="form-control"
                                    placeholder="First Name"
                                    onChange={e => setUser({ ...user, First_Name: e.target.value })}
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
                                    className="form-control"
                                    placeholder="Last Name"
                                    onChange={e => setUser({ ...user, Last_Name: e.target.value })}
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
                                    onChange={e => setUser({ ...user, Password: e.target.value })}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                                </div>
                            </div>
                        </form>
                        <p className="mb-0">
                            <a href="/login" className="text-center">I already have a membership</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
