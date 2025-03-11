import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from "../context/AppContext.jsx";

const ProductDetail = () => {
    const { slug } = useParams(); // URL'den ürün slug'ını alıyoruz
    const { backendUrl, cart, setCart, isAuthenticated } = useApp();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [apiResponse, setApiResponse] = useState(null); // API yanıtını saklamak için

    // Sayfa yüklendiğinde ürün verilerini getir
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const endpoint = `${backendUrl}/products/slug/${slug}`;
                console.log(`Ürün detayları alınıyor: ${endpoint}`);

                // Slug ile ürün detaylarını alıyoruz
                const response = await axios.get(endpoint);
                console.log("API yanıtı:", response.data);

                // Tam API yanıtını state'e kaydet (hata ayıklama için)
                setApiResponse(response.data);

                // API'den dönen veri yapısını kontrol et
                if (response.data.success) {
                    let productData;

                    // Veri yapısını kontrol et ve doğru şekilde işle
                    if (response.data.data && response.data.data.product) {
                        productData = response.data.data.product;
                    } else if (response.data.data) {
                        productData = response.data.data;
                    } else {
                        productData = response.data;
                    }

                    console.log("İşlenen ürün verisi:", productData);

                    if (!productData) {
                        throw new Error('Ürün verisi bulunamadı');
                    }

                    setProduct(productData);

                    // Varsayılan renk ve beden seçimini ayarla (varsa)
                    if (productData.colors && productData.colors.length > 0) {
                        setSelectedColor(productData.colors[0].id);
                    }

                    if (productData.sizes && productData.sizes.length > 0) {
                        setSelectedSize(productData.sizes[0].id);
                    }
                } else {
                    throw new Error('API başarısız yanıt döndü');
                }

                setLoading(false);
            } catch (err) {
                console.error('Ürün detayları alınırken hata oluştu:', err);
                console.error('Hata detayları:', err.response?.data);
                setError('Ürün yüklenemedi. Lütfen daha sonra tekrar deneyin.');
                setLoading(false);
            }
        };

        if (slug && backendUrl) {
            fetchProductDetails();
        }
    }, [slug, backendUrl]);

    // Sepete ekleme fonksiyonu
    const handleAddToCart = () => {
        if (!product) return;

        try {
            // Renk ve beden seçimi varsa kontrol et
            if (product.colors && product.colors.length > 0 && !selectedColor) {
                alert('Lütfen bir renk seçin.');
                return;
            }

            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                alert('Lütfen bir beden seçin.');
                return;
            }

            // Sepete ürün ekle
            const cartItem = {
                id: product.id,
                product,
                colorId: selectedColor,
                colorName: selectedColor ? product.colors.find(c => c.id === selectedColor)?.name || '' : '',
                sizeId: selectedSize,
                sizeName: selectedSize ? product.sizes.find(s => s.id === selectedSize)?.name || '' : '',
                quantity: 1,
                price: product.sale_price || product.price
            };

            setCart([...cart, cartItem]);
            alert('Ürün sepete eklendi');
        } catch (err) {
            console.error('Sepete eklerken hata oluştu:', err);
            alert('Ürün sepete eklenirken bir hata oluştu');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="text-center">
                    <h3>Hata</h3>
                    <p>{error}</p>
                    {apiResponse && (
                        <div className="mt-3">
                            <h5>API Yanıtı (Hata Ayıklama):</h5>
                            <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflow: 'auto' }}>
                                {JSON.stringify(apiResponse, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="text-center">
                    <h3>Ürün bulunamadı</h3>
                    {apiResponse && (
                        <div className="mt-3">
                            <h5>API Yanıtı (Hata Ayıklama):</h5>
                            <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflow: 'auto' }}>
                                {JSON.stringify(apiResponse, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Güvenli erişim fonksiyonları
    const getImages = () => product.images || [];
    const getCategories = () => product.categories || [];
    const getTags = () => product.tags || [];
    const getBrand = () => product.brand || {};
    const getColors = () => product.colors || [];
    const getSizes = () => product.sizes || [];

    // İndirim yüzdesini hesapla (eğer sale_price varsa)
    const salePrice = product.sale_price || null;
    const regularPrice = product.price;
    const discountPercentage = salePrice && regularPrice
        ? Math.round((1 - (salePrice / regularPrice)) * 100)
        : 0;

    return (
        <Container fluid className="product-detail-container p-0">
            <Row className="m-0">
                {/* Ürün Görselleri - Sol Taraf */}
                <Col md={8} className="product-images p-0">
                    <Row className="g-0">
                        {getImages().length > 0 ? (
                            // Ürün görselleri varsa onları göster
                            getImages().map((image, index) => (
                                <Col xs={12} md={6} key={index}>
                                    <div className="img-container position-relative">
                                        {index === 0 && discountPercentage > 0 && (
                                            <div className="discount-badge">%{discountPercentage} indirim</div>
                                        )}
                                        <img
                                            src={`${backendUrl}${image.url}`}
                                            className="img-fluid"
                                            alt={`${product.name} - Görünüm ${index + 1}`}
                                            onError={(e) => {
                                                console.log('Görsel yüklenemedi:', e.target.src);
                                                e.target.src = '/images/product-placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                </Col>
                            ))
                        ) : (
                            // Ürün görseli yoksa varsayılan görsel göster
                            <>
                                <Col xs={12} md={6}>
                                    <div className="img-container position-relative">
                                        {discountPercentage > 0 && (
                                            <div className="discount-badge">%{discountPercentage} indirim</div>
                                        )}
                                        <img
                                            src="/images/product-placeholder.jpg"
                                            className="img-fluid"
                                            alt="Ürün görseli"
                                        />
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <img
                                        src="/images/product-placeholder.jpg"
                                        className="img-fluid"
                                        alt="Ürün görseli"
                                    />
                                </Col>
                            </>
                        )}
                    </Row>
                </Col>

                {/* Ürün Bilgileri - Sağ Taraf */}
                <Col md={4} className="product-info py-4 px-4">
                    {/* Debug Bilgisi - Geliştirme sırasında kullanılabilir */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-3 p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '12px' }}>
                            <div><strong>ID:</strong> {product.id}</div>
                            <div><strong>Slug:</strong> {product.slug}</div>
                            <div><strong>Görsel sayısı:</strong> {getImages().length}</div>
                        </div>
                    )}

                    {/* Breadcrumbs */}
                    <div className="breadcrumbs small text-muted mb-2">
                        {getCategories().length > 0
                            ? getCategories().map(cat => cat.name).join(' / ')
                            : 'Kategoriler'
                        }
                    </div>

                    {/* Ürün Başlığı ve Fiyatı */}
                    <div className="product-header mb-3">
                        <h1 className="product-title mb-1">{product.name}</h1>
                        <h2 className="product-subtitle mb-3">{product.subtitle || `${getBrand().name || ''} Ürünü`}</h2>

                        {/* Değerlendirmeler */}
                        <div className="product-reviews mb-2">
                            <div className="d-flex align-items-center">
                                <div className="stars me-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="star">★</span>
                                    ))}
                                </div>
                                <span className="review-count">
                                    {product.rating || "5.0"} ({product.review_count || 3} Değerlendirme)
                                </span>
                            </div>
                        </div>

                        {/* Fiyat */}
                        <div className="product-price">
                            {salePrice ? (
                                <>
                                    <span className="regular-price text-decoration-line-through me-2">
                                        ₺{parseFloat(regularPrice).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </span>
                                    <span className="sale-price">
                                        ₺{parseFloat(salePrice).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </span>
                                </>
                            ) : (
                                <span className="regular-price">
                                    ₺{parseFloat(regularPrice).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Renk Seçimi */}
                    {getColors().length > 0 && (
                        <div className="color-selection mb-4">
                            <div className="option-label d-flex justify-content-between mb-2">
                                <span>Renk</span>
                                <span>
                                    {selectedColor ? getColors().find(c => c.id === selectedColor)?.name || "" : ""}
                                </span>
                            </div>
                            <div className="color-options">
                                {getColors().map((color) => (
                                    <button
                                        key={color.id}
                                        className={`color-swatch ${selectedColor === color.id ? 'selected' : ''}`}
                                        style={{ backgroundColor: color.hex_code || "#333" }}
                                        onClick={() => setSelectedColor(color.id)}
                                        aria-label={color.name}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Beden Seçimi */}
                    {getSizes().length > 0 && (
                        <div className="size-selection mb-4">
                            <div className="option-label d-flex justify-content-between mb-2">
                                <span>Beden</span>
                                <a href="#" className="size-guide-link">Beden Rehberi</a>
                            </div>
                            <div className="size-options">
                                {getSizes().map((size) => (
                                    <button
                                        key={size.id}
                                        className={`size-btn ${selectedSize === size.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size.id)}
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sepete Ekle Butonu */}
                    <Button
                        variant="dark"
                        className="w-100 add-to-bag-btn py-3 mb-4"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? 'SEPETE EKLE' : 'STOKTA YOK'}
                    </Button>

                    {/* Kargo, İade, Hediye Bilgileri */}
                    <div className="additional-info">
                        <div className="info-item d-flex mb-3">
                            <div className="info-icon me-3">
                                <i className="bi bi-truck"></i>
                            </div>
                            <div className="info-text">
                                <strong>Ücretsiz Kargo</strong>
                                <p className="mb-0 small">₺500 üzeri tüm siparişlerde. Daha fazla bilgi.</p>
                            </div>
                        </div>

                        <div className="info-item d-flex mb-3">
                            <div className="info-icon me-3">
                                <i className="bi bi-arrow-return-left"></i>
                            </div>
                            <div className="info-text">
                                <strong>Kolay İade</strong>
                                <p className="mb-0 small">14 gün içerisinde ücretsiz iade. İade Detayları.</p>
                            </div>
                        </div>

                        <div className="info-item d-flex mb-4">
                            <div className="info-icon me-3">
                                <i className="bi bi-gift"></i>
                            </div>
                            <div className="info-text">
                                <strong>Hediye Olarak Gönder</strong>
                                <p className="mb-0 small">Ödeme sırasında ücretsiz kişiselleştirilmiş not ekleyin.</p>
                            </div>
                        </div>
                    </div>

                    {/* Ürün Açıklaması */}
                    <div className="product-description mb-4">
                        <h3 className="section-title mb-3">{getBrand().name || ''} {product.name}</h3>
                        <p className="description-text">
                            {product.description ||
                                `${product.name} ürünü ${getBrand().name || ''} markasının kaliteli ve dayanıklı ürünlerinden biridir. 
                                ${getCategories().length > 0 ? getCategories()[0].name : ''} kategorisinde yer alan bu ürün, 
                                modern tasarımı ve kullanım kolaylığı ile öne çıkıyor.`
                            }
                        </p>
                    </div>

                    {/* Marka Bilgisi */}
                    {getBrand().name && (
                        <div className="model-info mb-4">
                            <div className="d-flex justify-content-between">
                                <strong>Marka</strong>
                                <span>{getBrand().name}</span>
                            </div>
                        </div>
                    )}

                    {/* Stok Bilgisi */}
                    <div className="fit-info mb-4">
                        <div className="d-flex justify-content-between">
                            <strong>Stok Durumu</strong>
                            <div className="fit-links text-end">
                                <p className="mb-0">{product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}</p>
                                {product.sku && <p className="mb-0">SKU: {product.sku}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Etiketler */}
                    {getTags().length > 0 && (
                        <div className="sustainability-info">
                            <div className="mb-2">
                                <strong>Etiketler</strong>
                            </div>
                            <div className="d-flex flex-wrap">
                                {getTags().map(tag => (
                                    <span key={tag.id} className="badge bg-secondary me-2 mb-2">{tag.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;