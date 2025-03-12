import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from "../context/AppContext.jsx";
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { slug } = useParams(); // URL'den ürün slug'ını alıyoruz
    const { backendUrl, cart, setCart, isAuthenticated, addToCart, setIsCartOpen } = useApp();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1); // Miktar için state ekledik
    const [apiResponse, setApiResponse] = useState(null); // API yanıtını saklamak için

    // Renk adından hex koduna dönüşüm yapan yardımcı fonksiyon
    const getColorHexCode = (colorName) => {
        const colorMap = {
            'Kırmızı': '#FF0000',
            'Yeşil': '#008000',
            'Mavi': '#0000FF',
            'Siyah': '#000000',
            'Beyaz': '#FFFFFF',
            'Sarı': '#FFFF00',
            'Turuncu': '#FFA500',
            'Mor': '#800080',
            'Pembe': '#FFC0CB',
            'Gri': '#808080',
            'Kahverengi': '#A52A2A'
            // Daha fazla renk eklenebilir
        };

        return colorMap[colorName] || '#333333'; // Eğer tanımlı değilse varsayılan gri renk
    };

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

    // Miktar değişimini yönet
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            // Stok miktarını aşmamak için kontrol
            const maxStock = product.stock || 999;
            setQuantity(Math.min(value, maxStock));
        }
    };

    // Miktar artırma
    const increaseQuantity = () => {
        if (product && product.stock) {
            // Stok miktarını aşmamak için kontrol
            setQuantity(prev => Math.min(prev + 1, product.stock));
        } else {
            setQuantity(prev => prev + 1);
        }
    };

    // Miktar azaltma
    const decreaseQuantity = () => {
        setQuantity(prev => Math.max(prev - 1, 1)); // Minimum 1 miktar
    };

    // Sepete ekleme fonksiyonu
    const handleAddToCart = () => {
        if (!product) return;

        try {
            // Renk ve beden seçimi varsa kontrol et
            if (product.colors && product.colors.length > 0 && !selectedColor) {
                toast.error('Lütfen bir renk seçin.');
                return;
            }

            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                toast.error('Lütfen bir beden seçin.');
                return;
            }

            // Seçilen renk ve beden adlarını bul
            const colorName = selectedColor
                ? product.colors.find(c => c.id === selectedColor)?.name || ''
                : '';

            const sizeName = selectedSize
                ? product.sizes.find(s => s.id === selectedSize)?.name || ''
                : '';

            // Ürün fiyatını belirle
            const price = product.sale_price || product.price;

            // Sepete eklenecek olan ürün
            const productToAdd = {
                id: product.id,
                name: product.name,
                price: parseFloat(price),
                image: product.images && product.images.length > 0
                    ? `${backendUrl}${product.images[0].url}`
                    : '/images/product-placeholder.jpg',
                size: sizeName,
                color: colorName,
                quantity: quantity,
                productRef: product  // Gerekirse ürünün tamamına referans
            };

            // Context'ten gelen addToCart fonksiyonu varsa kullan
            if (typeof addToCart === 'function') {
                addToCart(productToAdd);
            } else {
                // Yoksa manuel olarak cart'ı güncelle
                // Önce sepette aynı ürün (aynı id, renk ve beden) var mı diye kontrol
                const existingItemIndex = cart.findIndex(item =>
                    item.id === product.id &&
                    item.color === colorName &&
                    item.size === sizeName
                );

                let newCart;
                if (existingItemIndex !== -1) {
                    // Ürün zaten sepette, miktarını artır
                    newCart = [...cart];
                    newCart[existingItemIndex].quantity += quantity;
                    toast.info('Ürün miktarı güncellendi');
                } else {
                    // Ürün sepette yok, sepete ekle
                    newCart = [...cart, productToAdd];
                    toast.success('Ürün sepete eklendi');
                }

                setCart(newCart);
                // Sepet panelini aç
                if (typeof setIsCartOpen === 'function') {
                    setIsCartOpen(true);
                }
            }
        } catch (err) {
            console.error('Sepete eklerken hata oluştu:', err);
            toast.error('Ürün sepete eklenirken bir hata oluştu');
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
                            <div><strong>Renk sayısı:</strong> {getColors().length}</div>
                            <div><strong>Beden sayısı:</strong> {getSizes().length}</div>
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
                                        style={{ backgroundColor: getColorHexCode(color.name) }}
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

                    {/* Miktar Seçimi */}
                    <div className="quantity-selection mb-4">
                        <div className="option-label mb-2">
                            <span>Miktar</span>
                        </div>
                        <InputGroup className="quantity-input">
                            <Button
                                variant="outline-secondary"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                                className="quantity-btn"
                            >
                                -
                            </Button>
                            <Form.Control
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={product.stock || 999}
                                className="text-center"
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={increaseQuantity}
                                disabled={product.stock && quantity >= product.stock}
                                className="quantity-btn"
                            >
                                +
                            </Button>
                        </InputGroup>
                        {product.stock && product.stock < 10 && (
                            <div className="mt-2 text-danger small">
                                <i className="bi bi-exclamation-circle"></i> Sadece {product.stock} adet kaldı
                            </div>
                        )}
                    </div>

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