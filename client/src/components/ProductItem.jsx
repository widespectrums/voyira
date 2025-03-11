import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useApp } from "../context/AppContext.jsx";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { backendUrl } = useApp();

    useEffect(() => {
        setLoading(true);
        axios.get(`${backendUrl}/products`)
            .then(response => {
                console.log("API Yanıtı:", response.data);
                setProducts(response.data.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Ürünleri çekerken hata oluştu:", error);
                setLoading(false);
            });
    }, [backendUrl]);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return `${backendUrl}/assets/images/ecommerce/png/1.png`;
        return imageUrl.startsWith("http") ? imageUrl : `${backendUrl}${imageUrl}`;
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (event, product) => {
        event.stopPropagation();
        console.log("Sepete eklendi:", product);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="container">
                <h3 className="mb-4 fw-bold">Related Products</h3>
                <div className="row">
                    {products.length > 0 ? (
                        products.slice(0, 4).map((product) => (
                            <div key={product.id} className="col-12 col-sm-6 col-lg-3 mb-4">
                                <div className="card border-0 h-100" onClick={() => handleProductClick(product.id)} style={{ cursor: "pointer" }}>
                                    <div style={{ position: "relative" }}>
                                        {product.images?.length > 0 ? (
                                            <div id={`carousel-${product.id}`} className="carousel slide" data-bs-ride="carousel">
                                                <div className="carousel-indicators">
                                                    {product.images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            data-bs-target={`#carousel-${product.id}`}
                                                            data-bs-slide-to={index}
                                                            className={index === 0 ? "active" : ""}
                                                        ></button>
                                                    ))}
                                                </div>
                                                <div className="carousel-inner">
                                                    {product.images.map((image, index) => (
                                                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                                            <img
                                                                src={getImageUrl(image.url)}
                                                                className="d-block w-100"
                                                                alt={product.name}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${product.id}`} data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon"></span>
                                                </button>
                                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${product.id}`} data-bs-slide="next">
                                                    <span className="carousel-control-next-icon"></span>
                                                </button>
                                            </div>
                                        ) : (
                                            <img src={`${backendUrl}/assets/images/ecommerce/png/1.png`} className="d-block w-100" alt={product.name} />
                                        )}
                                    </div>
                                    <div className="card-body d-flex justify-content-between align-items-center p-3">
                                        <div>
                                            <h5 className="mb-2">{product.name}</h5>
                                            <span className="fw-bold">{Math.floor(parseFloat(product.price) * 0.8).toLocaleString('tr-TR')} ₺</span>
                                            <span className="text-muted text-decoration-line-through"> {parseFloat(product.price).toFixed(0).toLocaleString('tr-TR')} ₺</span>
                                        </div>
                                        <button className="btn btn-dark" onClick={(e) => handleAddToCart(e, product)}>
                                            <i className="bi bi-cart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">Ürün bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
