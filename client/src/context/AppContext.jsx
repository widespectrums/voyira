import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Get token from cookie instead of localStorage for better security
    const [token, setToken] = useState(Cookies.get('token') || null);
    const navigate = useNavigate();

    // Backend URL - replace with your actual backend URL
    const backendUrl = 'http://localhost:3100';

    // Update token when cookie changes
    useEffect(() => {
        const cookieToken = Cookies.get('token');
        if (cookieToken !== token) {
            setToken(cookieToken || null);
        }
    }, [token]);

    // Axios interceptor to handle token authentication
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            config => {
                const currentToken = Cookies.get('token');
                if (currentToken) {
                    config.headers['Authorization'] = `Bearer ${currentToken}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        // Handle 401 responses (unauthorized)
        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    // Auto logout on 401 responses
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // Logout function
    const logout = async () => {
        try {
            // Call backend logout endpoint if token exists
            if (token) {
                await axios.post(`${backendUrl}/auth/logout`);
            }
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            // Clear token from cookies and state
            Cookies.remove('token');
            setToken(null);
            navigate('/signin');
        }
    };

    // Check token validity on app start
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    await axios.get(`${backendUrl}/auth/validate-token`);
                } catch (error) {
                    // If token validation fails, logout
                    logout();
                }
            }
        };

        validateToken();
    }, []);

    return (
        <AppContext.Provider value={{
            token,
            setToken,
            navigate,
            backendUrl,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};