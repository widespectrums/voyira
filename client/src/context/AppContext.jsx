import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [cart, setCart] = useState([]); // Ensure cart is initialized as an empty array
    const navigate = useNavigate();
    const backendUrl = 'http://localhost:3100';

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

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${backendUrl}/auth/logout`);
            }
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            Cookies.remove('token');
            setToken(null);
            setCart([]); // Clear cart on logout
            navigate('/signin');
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    await axios.get(`${backendUrl}/auth/validate-token`);
                } catch (error) {
                    logout();
                }
            }
        };

        validateToken();
    }, [token]);

    return (
        <AppContext.Provider value={{
            token,
            setToken,
            cart,
            setCart, // Provide a way to modify the cart
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
