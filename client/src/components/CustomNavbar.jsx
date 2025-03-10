import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Container, Form, FormControl, Button, Offcanvas } from "react-bootstrap";
import { BsPerson, BsSearch, BsStar, BsCart } from "react-icons/bs";
import { useLocation } from "react-router-dom";

const CustomNavbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isNavbarHovered, setIsNavbarHovered] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:3000/categories");
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

    // Ana sayfa için navbar stilini değiştir (şeffaf), diğer sayfalar için başka stil (siyah)
    const navbarStyle = isHomePage
        ? `custom-navbar ${isScrolled ? 'scrolled' : ''} ${isNavbarHovered ? 'hovered' : ''}`
        : 'custom-navbar other-page';

    // Ana sayfa için text rengini değiştir, diğer sayfalar için sabit beyaz
    const textStyle = isHomePage
        ? `${isNavbarHovered ? 'text-dark' : 'text-white'}`
        : 'text-white';

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
                                    className="custom-dropdown"
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
                                        <div className="dropdown-content">
                                            <Container>
                                                <div className="row">
                                                    {category.subCategories.map((subCategory) => (
                                                        <div className="col-md-3" key={subCategory.id}>
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
                                href="/cart"
                                className={`icon-btn ${textStyle}`}
                            >
                                <BsCart />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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
        </>
    );
};

export default CustomNavbar;