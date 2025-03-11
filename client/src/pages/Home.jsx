import Carousel from "../components/Carousel.jsx";
import Marquee from "../components/Marquee.jsx";
import ProductDetail from "../components/ProductItem.jsx";

const Home = () => {
    return (
        <div>
            <Carousel />
            <Marquee/>
            <ProductDetail  />
        </div>
    );
};

export default Home;