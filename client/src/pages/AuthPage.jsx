import { useState, useEffect } from 'react';
import { useApp } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const AuthPage = () => {
    const { navigate, backendUrl } = useApp();
    const [authMode, setAuthMode] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        otp: '',
        firstName: '',
        lastName: ''
    });
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Handle resend cooldown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = (type) => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (type === 'login') {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            }
        } else if (type === 'signup') {
            if (!formData.firstName) {
                newErrors.firstName = 'First name is required';
            }
            if (!formData.lastName) {
                newErrors.lastName = 'Last name is required';
            }

            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (type === 'forgotPassword' && otpSent) {
            if (!formData.otp) {
                newErrors.otp = 'Verification code is required';
            } else if (formData.otp.length !== 6) {
                newErrors.otp = 'Verification code must be 6 digits';
            }

            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fixed function for sending OTPs
    const sendOtp = async (type = 'registration') => {
        // For resending, we don't need to revalidate the whole form
        const needsValidation = !otpSent;
        if (needsValidation && !validateForm(type === 'registration' ? 'signup' : 'forgotPassword')) {
            return;
        }

        setIsLoading(true);
        try {
            // Select the correct endpoint based on the operation type
            let endpoint;
            const requestData = { email: formData.email };

            if (type === 'registration') {
                // For registration OTP
                endpoint = '/auth/initialize-registration';
                // If resending, we might need a different endpoint or parameter
                if (otpSent) {
                    endpoint = '/auth/resend-verification-email';
                }
            } else {
                // For forgot password OTP
                endpoint = '/auth/send-forget-password-otp';
            }

            const response = await axios.post(`${backendUrl}${endpoint}`, requestData);

            setOtpSent(true);
            setResendCooldown(20); // 60 seconds cooldown
            toast.success('Verification code sent to your email!');
        } catch (error) {
            console.error("OTP Send Error:", error);
            const errorMessage = error.response?.data?.message || 'Failed to send verification code';
            toast.error(errorMessage);

            // If error indicates email already exists but we're in signup flow,
            // we could handle it specially
            if (type === 'registration' && errorMessage.includes('exist')) {
                toast.info('Try logging in or use a different email address.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (!validateForm('signup')) {
            return;
        }

        if (!otpSent) {
            sendOtp('registration');
            return;
        }

        if (!formData.otp) {
            setErrors(prev => ({...prev, otp: 'Verification code is required'}));
            return;
        }

        setIsLoading(true);
        try {
            // Fix the endpoint to match your backend
            const response = await axios.post(`${backendUrl}/auth/complete-registration`, {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                emailVerifyOtp: formData.otp
            });

            toast.success('Registration completed successfully!');

            // Auto login after successful registration
            const loginResponse = await axios.post(`${backendUrl}/auth/login`, {
                email: formData.email,
                password: formData.password
            });

            // Store token in cookies (more secure than localStorage)
            const tokenValue = loginResponse.data.token || loginResponse.data.user?.id;
            Cookies.set('token', tokenValue, { expires: 7, secure: true });

            // Also update context
            if (typeof window !== 'undefined') {
                navigate('/');
            }
        } catch (error) {
            console.error("Registration Error:", error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm('login')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/auth/login`, {
                email: formData.email,
                password: formData.password
            });

            // Store token in cookies (more secure than localStorage)
            // Handle different response structures
            const tokenValue = response.data.token || response.data.user?.id;
            Cookies.set('token', tokenValue, { expires: 7, secure: true });

            toast.success('Login Successful!');
            navigate('/');
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!otpSent) {
            sendOtp('forgotPassword');
            return;
        }

        if (!validateForm('forgotPassword')) {
            return;
        }

        setIsLoading(true);
        try {
            // Fix the endpoint to match your backend
            await axios.post(`${backendUrl}/auth/recover-password`, {
                email: formData.email,
                forgetPasswordOtp: formData.otp,
                password: formData.password
            });

            toast.success('Password reset successful!');
            setAuthMode('login');
            setOtpSent(false);
        } catch (error) {
            console.error("Password Reset Error:", error);
            toast.error(error.response?.data?.message || 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        switch(authMode) {
            case 'signup':
                return (
                    <form onSubmit={handleRegistration} className="needs-validation">
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">First Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={otpSent && isLoading}
                                    required
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>
                            <div className="col">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={otpSent && isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={otpSent}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={otpSent && isLoading}
                                    required
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={togglePassword}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <div className="form-text">Password must be at least 8 characters</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                disabled={otpSent && isLoading}
                                required
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>

                        {otpSent && (
                            <div className="mb-3">
                                <label className="form-label">Verification Code <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                                        name="otp"
                                        maxLength="6"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => sendOtp('registration')}
                                        disabled={resendCooldown > 0 || isLoading}
                                    >
                                        {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend'}
                                    </button>
                                    {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </span>
                            ) : otpSent ? 'Complete Registration' : 'Send Verification Code'}
                        </button>
                    </form>
                );
            case 'forgotPassword':
                return (
                    <form onSubmit={handlePasswordReset} className="needs-validation">
                        <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={otpSent}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {otpSent && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Verification Code <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                                            name="otp"
                                            maxLength="6"
                                            value={formData.otp}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => sendOtp('forgotPassword')}
                                            disabled={resendCooldown > 0 || isLoading}
                                        >
                                            {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend'}
                                        </button>
                                        {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">New Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>
                                    <div className="form-text">Password must be at least 8 characters</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </span>
                            ) : otpSent ? 'Reset Password' : 'Send Reset Code'}
                        </button>
                    </form>
                );
            default: // login
                return (
                    <form onSubmit={handleLogin} className="needs-validation">
                        <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mb-3">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe"/>
                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                            </div>
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => {
                                    setAuthMode('forgotPassword');
                                    setOtpSent(false);
                                    setFormData(prev => ({...prev, otp: '', password: '', confirmPassword: ''}));
                                    setErrors({});
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{minHeight: '100vh', padding: '2rem 0'}}>
            <div className="card shadow-sm border-0" style={{maxWidth: '460px', width: '100%'}}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">
                        {authMode === 'login' ? 'Sign In' :
                            authMode === 'signup' ? 'Create Account' :
                                'Reset Password'}
                    </h2>

                    {renderForm()}

                    {authMode === 'login' && (
                        <div className="text-center mt-4">
                            <p className="mb-0">Do not have an account?{' '}
                                <button
                                    className="btn btn-link p-0"
                                    onClick={() => {
                                        setAuthMode('signup');
                                        setOtpSent(false);
                                        setFormData({
                                            email: '',
                                            password: '',
                                            confirmPassword: '',
                                            otp: '',
                                            firstName: '',
                                            lastName: ''
                                        });
                                        setErrors({});
                                    }}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    )}

                    {authMode !== 'login' && (
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-link p-0"
                                onClick={() => {
                                    setAuthMode('login');
                                    setOtpSent(false);
                                    setFormData({
                                        email: '',
                                        password: '',
                                        confirmPassword: '',
                                        otp: '',
                                        firstName: '',
                                        lastName: ''
                                    });
                                    setErrors({});
                                }}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;