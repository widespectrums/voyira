import {useState} from 'react';
import {Navbar, Nav, Container, Form, FormControl, Button, Offcanvas} from 'react-bootstrap';
import {BsPerson, BsSearch, BsStar, BsCart} from 'react-icons/bs';

const CustomNavbar = () => {
    const [searchOpen, setSearchOpen] = useState(false); // Arama panelinin açık/kapalı durumu
    const [searchTerm, setSearchTerm] = useState(""); // Arama terimi

    // Arama panelini açma/kapama fonksiyonu
    const toggleSearchPanel = () => setSearchOpen(!searchOpen);

    return (
        <div>
            <Navbar expand="lg" bg="light" variant="light" className="sticky-navbar p-3 m-sm-2 ">
                <Container fluid>
                    <Navbar.Brand href="/">WIDE SPECTRUMS</Navbar.Brand>
                    {/* Mobil Menü*/}
                    <Navbar.Toggle aria-controls="navbarNav"/>
                    {/* Navbar Menü */}
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto">
                            <Nav.Link href="#home" className="category-link">WOMAN</Nav.Link>
                            <Nav.Link href="#features" className="category-link">MAN</Nav.Link>
                            <Nav.Link href="#pricing" className="category-link">CHILD</Nav.Link>
                            <Nav.Link href="#HOME" className="category-link">HOME</Nav.Link>
                        </Nav>
                        <Nav className="d-flex">
                            <Nav.Link onClick={toggleSearchPanel} className="d-flex align-items-center mx-2">
                                <BsSearch size={16}/>
                            </Nav.Link>
                            <Nav.Link href="/signup" className="d-flex align-items-center mx-2"><BsPerson
                                size={20}/></Nav.Link>
                            <Nav.Link href="/favorites" className="d-flex align-items-center mx-2"><BsStar
                                size={20}/></Nav.Link>
                            <Nav.Link href="/cart" className="d-flex align-items-center mx-2"><BsCart
                                size={20}/></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Arama Paneli (Offcanvas) */}
            <Offcanvas show={searchOpen} onHide={toggleSearchPanel} placement="end">
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search..."
                            className="me-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-dark" type="submit"><BsSearch size={16}/></Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default CustomNavbar;
