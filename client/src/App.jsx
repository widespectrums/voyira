import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./assets/libs/bootstrap/css/bootstrap.min.css";
import "./assets/css/styles.css";
import "./assets/css/icons.css";
import "./assets/libs/node-waves/waves.min.css";
import "./assets/libs/simplebar/simplebar.min.css";
import "./assets/libs/flatpickr/flatpickr.min.css";
import "./assets/libs/@simonwep/pickr/themes/nano.min.css";
import "./assets/libs/choices.js/public/assets/styles/choices.min.css";
import "./assets/libs/@tarekraafat/autocomplete.js/css/autoComplete.css";
import "./assets/js/authentication-main.js"
import "./assets/js/show-password.js"
import "./assets/libs/bootstrap/js/bootstrap.bundle.min.js"

// import "./assets/js/particles.js"
//
// import "./assets/js/basic-password.js"
// import "./assets/js/show-password.js"

import "./assets/libs/choices.js/public/assets/scripts/choices.min.js";
import "./assets/js/main.js";

import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from "./pages/AuthPage.jsx";
import Orders from "./pages/Orders.jsx";
import Footer from "./components/Footer.jsx";
import CartPage from "./pages/CartPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import CustomNavbar from "./components/CustomNavbar.jsx";

const App = () => {
    return (
        <div>
            <ToastContainer/>
            <CustomNavbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/signup" element={<Login/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/product/:id" element={<ProductPage/>}/>
                <Route path="/order/:id" element={<OrderPage/>}/>
                <Route path="/payment" element={<PaymentPage/>}/>
            </Routes>
            <Footer/>
        </div>
    );
};

export default App;