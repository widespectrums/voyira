import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ShopProvider} from "./context/AppContext.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ShopProvider>
            <App />
        </ShopProvider>
    </BrowserRouter>
)