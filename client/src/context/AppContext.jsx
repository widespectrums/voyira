import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const navigate = useNavigate();

    // Backend URL - replace with your actual backend URL
    const backendUrl = 'http://localhost:3100';

    // Axios interceptor to handle token authentication
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            config => {
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [token]);

    // Logout function
    const logout = () => {
        try {
            // Call backend logout endpoint
            axios.post(`${backendUrl}/auth/logout`);
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            // Clear token from localStorage and state
            localStorage.removeItem('token');
            setToken(null);
            navigate('/signin');
        }
    };

    return (
        <AppContext.Provider value={{
            token,
            setToken,
            navigate,
            backendUrl,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};