import {  useEffect, useState } from 'react';
import { useShop} from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import {  useLocation } from 'react-router-dom';

const Login = () => {
    const { token, setToken, navigate, backendUrl } = useShop();
    const location = useLocation();

    const [currentState, setCurrentState] = useState(location.pathname === '/signup' ? 'Sign Up' : 'Login');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if(location.pathname === '/signup') {
            setCurrentState('Sign Up');
        } else {
            setCurrentState('Login');
        }
    }, [location]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleFormSwitch = (newState) => {
        setCurrentState(newState);
        navigate(newState === 'Sign Up' ? '/signup' : '/signin');
    };

    const onSubmitHandler = async(event) => {
        event.preventDefault();
        try{
            if(currentState === 'Sign Up'){
                if(password !== confirmPassword) {
                    toast.error("Passwords don't match!");
                    return;
                }
                const response = await axios.post(backendUrl + '/api/user/register', {name, email, password});
                handleAuthResponse(response, "Sign Up");
            } else {
                const response = await axios.post(backendUrl + '/api/user/login', {email, password});
                handleAuthResponse(response, "Login");
            }
        } catch (error){
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleAuthResponse = (response, action) => {
        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            toast.success(`${action} Successful!`);
            navigate('/');
        } else {
            toast.error(response.data.message);
        }
    };

    useEffect(() => {
        if(token){
            navigate('/');
        }
    }, [token]);

    return (
        <div className="container-lg">
            <div className="row justify-content-center authentication authentication-basic align-items-center h-100">
                <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-12">
                    <div className="card custom-card my-4 border z-3 position-relative">
                        <div className="card-body p-0">
                            <div className="p-5">
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <span className="auth-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="password">
                                            {/* SVG içeriği buraya */}
                                        </svg>
                                    </span>
                                </div>
                                <p className="h4 fw-semibold mb-0 text-center">{currentState}</p>
                                <p className="mb-3 text-muted fw-normal text-center">
                                    {currentState === 'Login' ? 'Welcome back!' : 'Join us by creating a free account!'}
                                </p>

                                <form onSubmit={onSubmitHandler}>
                                    <div className="row gy-3">
                                        {currentState === 'Sign Up' && (
                                            <div className="col-xl-12">
                                                <label className="form-label text-default">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Enter Full Name"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="col-xl-12">
                                            <label className="form-label text-default">
                                                {currentState === 'Login' ? 'Email' : 'Email Address'}
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control form-control-lg"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={currentState === 'Login' ? 'Enter Email' : 'example@example.com'}
                                                required
                                            />
                                        </div>

                                        <div className="col-xl-12">
                                            <label className="form-label text-default">Password</label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-control form-control-lg"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-link text-muted position-absolute end-0 top-50 translate-middle-y"
                                                    onClick={togglePassword}
                                                >
                                                    <i className={`ri-eye${showPassword ? '' : '-off'}-line`}></i>
                                                </button>
                                            </div>
                                        </div>

                                        {currentState === 'Sign Up' && (
                                            <div className="col-xl-12">
                                                <label className="form-label text-default">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control form-control-lg"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm Password"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        {currentState === 'Login' && (
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="rememberMe"/>
                                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                            </div>
                                        )}
                                        <a href="#!" className="text-primary fs-12">
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <div className="d-grid mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                        >
                                            {currentState === 'Login' ? 'Sign In' : 'Create Account'}
                                        </button>
                                    </div>

                                    <div className="text-center mt-4">
                                        <p className="text-muted mb-0">
                                            {currentState === 'Login' ? (
                                                <>Dont have an account?{' '}
                                                    <button
                                                        type="button"
                                                        className="text-primary btn btn-link p-0"
                                                        onClick={() => handleFormSwitch('Sign Up')}
                                                    >
                                                        Sign Up
                                                    </button>
                                                </>
                                            ) : (
                                                <>Already have an account?{' '}
                                                    <button
                                                        type="button"
                                                        className="text-primary btn btn-link p-0"
                                                        onClick={() => handleFormSwitch('Login')}
                                                    >
                                                        Sign In
                                                    </button>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;