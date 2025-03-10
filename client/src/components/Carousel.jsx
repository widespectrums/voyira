import React from 'react';
import Image1 from '../assets/carousel-images/c-image-1.jpg';
import Image2 from '../assets/carousel-images/c-image-2.jpg';
import Image3 from '../assets/carousel-images/c-image-3.jpg';


const Carousel = () => {
    return (
        <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                ></button>
                <button
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                ></button>
                <button
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                ></button>
            </div>
            {/* Carousel Items */}
            <div className="carousel-inner ratio ratio-16x9">
                <div className="carousel-item active" data-bs-interval="10000">
                    <img
                        src={Image1}
                        className="d-block w-100"
                        alt="First slide"
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p className="op-7">Some representative placeholder content for the first slide.</p>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                    <img
                        src={Image2}
                        className="d-block w-100"
                        alt="Second slide"
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p className="op-7">Some representative placeholder content for the second slide.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img
                        src={Image3}
                        className="d-block w-100"
                        alt="Third slide"
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Third slide label</h5>
                        <p className="op-7">Some representative placeholder content for the third slide.</p>
                    </div>
                </div>
            </div>

            {/* Carousel Controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Carousel;