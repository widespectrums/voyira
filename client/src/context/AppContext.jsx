import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();

    // Fix: Use the correct environment variable format for Vite
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

    // Sepet İşlemleri
    const addToCart = (product) => {
        setCart(prevCart => {
            // Ürün sepette var mı kontrol et
            const existingItem = prevCart.find(item =>
                item.id === product.id &&
                item.size === product.size &&
                item.color === product.color
            );

            let newCart;
            if (existingItem) {
                // Ürün zaten sepette, miktarını artır
                newCart = prevCart.map(item =>
                    (item.id === product.id && item.size === product.size && item.color === product.color)
                        ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                        : item
                );
                toast.info('Ürün miktarı güncellendi');
            } else {
                // Ürün sepette yok, sepete ekle
                newCart = [...prevCart, { ...product, quantity: product.quantity || 1 }];
                toast.success('Ürün sepete eklendi');
            }

            // Sepeti güncelle ve sepet panelini aç
            setIsCartOpen(true);
            return newCart;
        });
    };

    const removeFromCart = (itemId, size, color) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item =>
                !(item.id === itemId && item.size === size && item.color === color)
            );
            toast.info('Ürün sepetten çıkarıldı');
            return newCart;
        });
    };

    const updateCartItemQuantity = (itemId, size, color, newQuantity) => {
        if (newQuantity < 1) return;

        setCart(prevCart => {
            return prevCart.map(item =>
                (item.id === itemId && item.size === size && item.color === color)
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCart([]);
        toast.info('Sepet temizlendi');
    };

    return (
        <AppContext.Provider value={{
            token,
            setToken,
            cart,
            setCart,
            isCartOpen,
            setIsCartOpen,
            navigate,
            backendUrl,
            logout,
            isAuthenticated: !!token,
            // Sepet işlevleri
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};

// Export the context itself for cases where useContext is needed directly
export default AppContext;