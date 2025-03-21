import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Container, Form, FormControl, Button, Offcanvas } from "react-bootstrap";
import { BsPerson, BsSearch, BsStar, BsCart } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import CartPage from "../pages/CartPage.jsx";

const CustomNavbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const { backendUrl, cart, isCartOpen, setIsCartOpen } = useApp();

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isNavbarHovered, setIsNavbarHovered] = useState(false);

    // Sepetteki toplam ürün sayısını hesapla
    const cartItemCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendUrl}/categories`);

                if (response.data.success) {
                    setCategories(response.data.data.categoryTree);
                }
            } catch (error) {
                console.error("API isteği sırasında hata oluştu:", error);
            }
        };

        fetchCategories();

        // Add scroll event listener
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleSearchPanel = () => setSearchOpen(!searchOpen);
    const toggleCartPanel = () => {
        console.log("Sepet panel durumu değiştiriliyor:", !isCartOpen);
        setIsCartOpen(!isCartOpen);
    };

    // Ana sayfa için navbar stilini değiştir (şeffaf), diğer sayfalar için beyaz arkaplan
    const navbarStyle = isHomePage
        ? `custom-navbar ${isScrolled ? 'scrolled' : ''} ${isNavbarHovered ? 'hovered' : ''}`
        : 'custom-navbar white-bg';

    // Ana sayfa için text rengini değiştir, diğer sayfalar için sabit siyah
    const textStyle = isHomePage
        ? `${isNavbarHovered ? 'text-dark' : 'text-white'}`
        : 'text-dark';

    return (
        <>
            <Navbar
                expand="lg"
                className={navbarStyle}
                onMouseEnter={() => isHomePage && setIsNavbarHovered(true)}
                onMouseLeave={() => {
                    if (isHomePage && hoveredCategory === null) {
                        setIsNavbarHovered(false);
                    }
                }}
            >
                <Container fluid>
                    <Navbar.Brand
                        href="/"
                        className={`brand-text ${textStyle}`}
                    >
                        WIDE SPECTRUMS
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="custom-dropdown position-static"
                                    onMouseEnter={() => {
                                        setHoveredCategory(category.id);
                                        isHomePage && setIsNavbarHovered(true);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredCategory(null);
                                        setTimeout(() => {
                                            if (isHomePage && !isNavbarHovered) {
                                                setIsNavbarHovered(false);
                                            }
                                        }, 100);
                                    }}
                                >
                                    <div className={`nav-link ${textStyle}`}>
                                        {category.name}
                                    </div>

                                    {category.subCategories && category.subCategories.length > 0 && hoveredCategory === category.id && (
                                        <div className="dropdown-content w-100 position-absolute start-0">
                                            <Container fluid>
                                                <div className="row py-4">
                                                    {category.subCategories.map((subCategory) => (
                                                        <div className="col-md-3 mb-3" key={subCategory.id}>
                                                            <a
                                                                href={`/category/${subCategory.id}`}
                                                                className="dropdown-item"
                                                            >
                                                                {subCategory.name}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Container>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link
                                onClick={toggleSearchPanel}
                                className={`icon-btn ${textStyle}`}
                            >
                                <BsSearch />
                            </Nav.Link>
                            <Nav.Link
                                href="/signup"
                                className={`icon-btn ${textStyle}`}
                            >
                                <BsPerson />
                            </Nav.Link>
                            <Nav.Link
                                href="/favorites"
                                className={`icon-btn ${textStyle}`}
                            >
                                <BsStar />
                            </Nav.Link>
                            <Nav.Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleCartPanel();
                                }}
                                className={`icon-btn ${textStyle} position-relative`}
                                style={{ cursor: "pointer" }}
                            >
                                <BsCart />
                                {cartItemCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartItemCount}
                                        <span className="visually-hidden">ürün</span>
                                    </span>
                                )}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Arama Paneli */}
            <Offcanvas
                show={searchOpen}
                onHide={toggleSearchPanel}
                placement="end"
                className="search-panel"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-white">Search</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search..."
                            className="me-2 search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-light" type="submit">
                            <BsSearch />
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Sepet Paneli */}
            <Offcanvas
                show={isCartOpen}
                onHide={() => setIsCartOpen(false)}
                placement="end"
                className="cart-panel"
                style={{ maxWidth: "400px", width: "100%" }}
                id="cartOffcanvas"
            >
                <Offcanvas.Header closeButton className="p-0 border-0">
                </Offcanvas.Header>
                <CartPage inNavbar={true} />
            </Offcanvas>
        </>
    );
};

export default CustomNavbar;