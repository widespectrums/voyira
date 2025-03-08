import { useState } from 'react';
import { useApp } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const AuthPage = () => {
    const { navigate, backendUrl } = useApp();
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: '',
        firstName: '',
        lastName: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    const sendOtp = async (type = 'registration') => {
        try {
            const endpoint = type === 'registration'
                ? '/auth/initialize-registration'
                : '/auth/send-forget-password-otp';

            const response = await axios.post(`${backendUrl}${endpoint}`, {
                email: formData.email});
            setOtpSent(true);
            toast.success('Verification code sent to your email!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
    };
    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/auth/complete-registration`, {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                emailVerifyOtp: formData.otp
            });
            toast.success('Registration completed successfully!');
            setAuthMode('login'); // Giriş sayfasına yönlendir
            setOtpSent(false); // OTP durumunu sıfırla
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/auth/login`, {
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('token', response.data.data.accessToken); //COOKIEDE TUT!!!
            toast.success('Login Successful!');
            navigate('/'); // Ana sayfaya yönlendir
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };
    // Şifre sıfırlama işlemi burada sıkıntı var ilk önce maille code göndermek gerekiyor
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/auth/send-forget-password-otp`, {
                email: formData.email,
            });
            toast.success('Password reset successful!');
            setAuthMode('login'); // Giriş sayfasına yönlendir
            setOtpSent(false); // OTP durumunu sıfırla

        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed');
        }
    };
    const renderForm = () => {
        switch (authMode) {
            case 'signup':
                return (
                    <form onSubmit={!otpSent ? (e) => { e.preventDefault(); sendOtp('registration'); } : handleRegistration}>
                        {!otpSent ? (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={togglePassword}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Send Verification Code</button>
                            </>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Verification Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="otp"
                                        maxLength="6"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Complete Registration</button>
                            </>
                        )}
                    </form>
                );
            case 'forgotPassword':
                return (
                    <form onSubmit={!otpSent ? (e) => { e.preventDefault(); sendOtp('forgotPassword'); } : handlePasswordReset}>
                        {!otpSent ? (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Send Reset Code</button>
                            </>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Reset Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="otp"
                                        maxLength="6"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={togglePassword}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                            </>
                        )}
                    </form>
                );
            default: // login
                return (
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={togglePassword}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                            </div>
                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => {
                                    setAuthMode('forgotPassword');
                                    setOtpSent(false);
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Sign In</button>
                    </form>
                );
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">
                        {authMode === 'login' ? 'Sign In' :
                            authMode === 'signup' ? 'Sign Up' :
                                'Reset Password'}
                    </h2>

                    {renderForm()}

                    {authMode === 'login' && (
                        <div className="text-center mt-3">
                            <p>Dont have an account?
                                <button
                                    className="btn btn-link"
                                    onClick={() => {
                                        setAuthMode('signup');
                                        setOtpSent(false);
                                    }}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    )}

                    {(authMode === 'signup' && otpSent) && (
                        <div className="text-center mt-3">
                            <p>Didnt receive code?
                                <button
                                    className="btn btn-link"
                                    onClick={() => sendOtp('registration')}
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;