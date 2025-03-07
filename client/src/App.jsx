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
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/AuthPage.jsx";
import Orders from "./pages/Orders.jsx";
import Footer from "./components/Footer.jsx";


const App = () => {
    return (
        <div>
            <ToastContainer/>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route path="/orders" element={<Orders/>}/>
            </Routes>
            <Footer/>
        </div>
    );
};

export default App;