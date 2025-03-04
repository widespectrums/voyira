import React from 'react';

const Footer = () => {
    return (
        <footer className="container mt-5 pt-5">
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-4">
                    <img src="logo.png" alt="logo" className="mb-3" style={{ width: '130px' }} />
                    <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, eaque.
                    </p>
                </div>

                {/* COMPANY */}
                <div className="col-md-6 col-lg-2">
                    <h5 className="mb-3">COMPANY</h5>
                    <ul className="list-unstyled text-muted">
                        <li className="mb-2">Home</li>
                        <li className="mb-2">About Us</li>
                        <li className="mb-2">Delivery</li>
                        <li className="mb-2">Privacy Policy</li>
                    </ul>
                </div>

                {/* GET IN TOUCH */}
                <div className="col-md-6 col-lg-2">
                    <h5 className="mb-3">GET IN TOUCH</h5>
                    <ul className="list-unstyled text-muted">
                        <li className="mb-2">+90 555 000 00 00</li>
                        <li className="mb-2">info@ursamajor.com</li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center py-4 border-top">
                <p className="text-muted mb-0">Copyright 2025 @ All Right Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;