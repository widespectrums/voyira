import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:3000/products")
            .then(response => {
                console.log("API Yanıtı:", response.data);
                // Backend'den gelen veri yapısına göre products'ı ayarla
                setProducts(response.data.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Ürünleri çekerken hata oluştu:", error);
                setLoading(false);
            });
    }, []);

    // API sunucu URL'i ve görsel yolu ayarları
    const API_URL = "http://localhost:3000";

    // Görsel URL'sini oluşturur
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return "../assets/images/ecommerce/png/1.png";

        // URL zaten tam bir URL ise (http veya https ile başlıyorsa)
        if (imageUrl.startsWith('http')) return imageUrl;

        // URL'in başındaki slash'ı kontrol et
        const formattedUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

        return `${API_URL}${formattedUrl}`;
    };

    // Ürün görüntüleme sayfasına yönlendirme
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Sepete ekle
    const handleAddToCart = (product) => {
        console.log("Sepete eklendi:", product);
        // Burada sepete ekleme işlemi yapılabilir
    };

    // İstek listesine ekle
    const handleAddToWishlist = (product) => {
        console.log("İstek listesine eklendi:", product);
        // Burada istek listesine ekleme işlemi yapılabilir
    };

    // Yükleme durumunda gösterilecek
    if (loading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div>
            {Array.isArray(products) && products.length > 0 ? (
                <div className="row">
                    <div className="col-xxl-9">
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.id} className="col-xxl-3 col-lg-6 col-xl-4 col-sm-6 mb-4">
                                    <div className="card custom-card card-style-2">
                                        <div className="card-body p-0">
                                            {/* İndirim badge'i - API'den bu veriyi almıyoruz, şimdilik kaldırıldı */}
                                            {/* <span className="badge bg-primary rounded py-1 top-left-badge">24% Off</span> */}

                                            <div className="card-img-top p-2 border-bottom border-block-end-dashed">
                                                <div className="btns-container-1 align-items-center gap-1">
                                                    <a
                                                        href={`/product/${product.id}`}
                                                        className="btn btn-icon btn-primary"
                                                        data-bs-toggle="tooltip"
                                                        aria-label="Hızlı Bakış"
                                                        data-bs-original-title="Hızlı Bakış"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </a>
                                                    <button
                                                        className="btn btn-icon btn-secondary"
                                                        data-bs-toggle="tooltip"
                                                        aria-label="İstek Listesine Ekle"
                                                        data-bs-original-title="İstek Listesine Ekle"
                                                        onClick={() => handleAddToWishlist(product)}
                                                    >
                                                        <i className="ti ti-heart align-center"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-icon btn-success"
                                                        data-bs-toggle="tooltip"
                                                        aria-label="Sepete Ekle"
                                                        data-bs-original-title="Sepete Ekle"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <i className="ti ti-shopping-cart"></i>
                                                    </button>
                                                </div>
                                                <div className="img-box-2 bg-primary-transparent">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={getImageUrl(product.images[0].url)}
                                                            alt={product.name}
                                                            className="scale-img img-fluid w-100 rounded"
                                                            onError={(e) => {
                                                                console.log("Görsel yüklenemedi:", e.target.src);
                                                                e.target.onerror = null;
                                                                e.target.src = "../assets/images/ecommerce/png/1.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="../assets/images/ecommerce/png/1.png"
                                                            alt={product.name}
                                                            className="scale-img img-fluid w-100 rounded"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h6 className="mb-1 fw-semibold fs-16">
                                                    <a href={`/product/${product.id}`}>{product.name}</a>
                                                </h6>
                                                <div className="d-flex align-items-end justify-content-between flex-wrap">
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-baseline fs-11">
                                                            <div className="min-w-fit-content">
                                                                {/* Yıldız derecelendirmesi. API'den rating verisi gelmediği için sabit 4 yıldız */}
                                                                <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                                                                <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                                                                <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                                                                <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                                                                <span className="text-warning"><i className="bi bi-star"></i></span>
                                                            </div>
                                                            <p className="mb-1 ms-1 min-w-fit-content text-muted">
                                                                <span>(0)</span> <span>Değerlendirme</span>
                                                            </p>
                                                        </div>
                                                        {product.brand && (
                                                            <a href="javascript:void(0);" className="text-primary1 fs-13 fw-semibold">
                                                                {product.brand.name}
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="min-w-fit-content">
                                                        <h5 className="fw-semibold mb-0">{parseFloat(product.price).toLocaleString('tr-TR')} ₺</h5>
                                                        {/* Şu anda API'de indirimli fiyat olmadığından, bu kısmı yorum satırı yapıyoruz
                                                        <span className="fs-13 ms-2 text-muted text-decoration-line-through">$12957</span>
                                                        */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 pt-0 d-grid">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="btn btn-light"
                                                >
                                                    Sepete Ekle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Ürün bulunamadı.</p>
            )}
        </div>
    );
};

export default ProductList;