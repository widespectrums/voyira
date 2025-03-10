import Carousel from "../components/Carousel.jsx";
import Marquee from "../components/Marquee.jsx";
import ProductList from "../components/ProductItem.jsx";
import CustomNavbar from "../components/CustomNavbar.jsx";

const Home = () => {
    return (
        <div>
            <CustomNavbar />
            <Carousel />
            <Marquee/>
            <ProductList/>
        </div>
    );
};

export default Home;