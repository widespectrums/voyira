import {useState, useEffect} from "react";
import axios from "axios";
import {Navbar, Nav, Container, Form, FormControl, Button, Offcanvas, Dropdown,} from "react-bootstrap";
import {BsPerson, BsSearch, BsStar, BsCart, BsChevronDown, BsChevronUp,} from "react-icons/bs";

const CustomNavbar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3100/categories")
            .then((response) => {
                if (response.data.success) {
                    setCategories(response.data.data.categoryTree);
                }
            })
            .catch((error) => {
                console.error("API isteği sırasında hata oluştu:", error);
            });
    }, []);

    const toggleSearchPanel = () => setSearchOpen(!searchOpen);

    return (
        <div>
            <Navbar expand="lg" bg="light" variant="light" className="sticky-navbar p-3 m-sm-2">
                <Container fluid>
                    <Navbar.Brand href="/">WIDE SPECTRUMS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav"/>
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto">
                            {categories.map((category) => (
                                <Dropdown key={category.id} className="mx-2">
                                    <Dropdown.Toggle
                                        variant="light"
                                        className="border-0 bg-transparent text-dark d-flex align-items-center"
                                    >
                                        {category.name}{" "}
                                        {category.subCategories && category.subCategories.length > 0 && (
                                            <span className="ms-2">
                      </span>
                                        )}
                                    </Dropdown.Toggle>

                                    {category.subCategories && category.subCategories.length > 0 && (
                                        <Dropdown.Menu>
                                            {category.subCategories.map((subCategory) => (
                                                <Dropdown.Item key={subCategory.id} href={`#${subCategory.name}`}>
                                                    {subCategory.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    )}
                                </Dropdown>
                            ))}
                        </Nav>
                        <Nav className="d-flex">
                            <Nav.Link onClick={toggleSearchPanel} className="d-flex align-items-center mx-2">
                                <BsSearch size={16}/>
                            </Nav.Link>
                            <Nav.Link href="/signup" className="d-flex align-items-center mx-2">
                                <BsPerson size={20}/>
                            </Nav.Link>
                            <Nav.Link href="/favorites" className="d-flex align-items-center mx-2">
                                <BsStar size={20}/>
                            </Nav.Link>
                            <Nav.Link href="/cart" className="d-flex align-items-center mx-2">
                                <BsCart size={20}/>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Offcanvas show={searchOpen} onHide={toggleSearchPanel} placement="end">
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search..."
                            className="me-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-dark" type="submit">
                            <BsSearch size={16}/>
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default CustomNavbar;
