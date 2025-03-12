
import { useApp } from "../context/AppContext.jsx";
import { BsTrash } from "react-icons/bs";

const CartPage = ({ inNavbar = false }) => {
    const { cart, removeFromCart, updateCartItemQuantity, setIsCartOpen } = useApp();

    if (!cart) return null;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = totalPrice > 0 ? 99.99 : 0;
    const finalTotal = totalPrice + shippingCost;

    const handleRemove = (itemId, size, color) => {
        removeFromCart(itemId, size, color);
    };

    const handleQuantityChange = (itemId, size, color, newQuantity) => {
        if (newQuantity >= 1) {
            updateCartItemQuantity(itemId, size, color, newQuantity);
        }
    };

    // inNavbar prop true ise, bu Navbar içindeki sepet paneli olarak kullanılır
    if (inNavbar) {
        return (
            <div className="offcanvas-body p-0">
                <div className="p-3 border-bottom">
                    <h5 className="fw-bold mb-0">Sepetiniz</h5>
                </div>

                {cart.length === 0 ? (
                    <div className="p-4 text-center">
                        <p className="mb-0">Sepetiniz boş.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column h-100">
                        <div className="flex-grow-1 overflow-auto p-3">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}-${item.color}`} className="mb-4 position-relative">
                                    <div className="d-flex">
                                        {/* Ürün Görseli */}
                                        <div className="me-3" style={{ width: "80px", height: "80px", minWidth: "80px" }}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center">
                                                    <span className="text-muted small">Görsel yok</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Ürün Bilgileri */}
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{item.name}</h6>
                                            <p className="text-muted small mb-1">
                                                {item.size} | {item.color}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <p className="fw-bold mb-0">{item.price.toFixed(2)} TL</p>

                                                <div className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Silme butonu */}
                                    <button
                                        className="btn btn-sm position-absolute top-0 end-0 p-0"
                                        onClick={() => handleRemove(item.id, item.size, item.color)}
                                        style={{ background: "none", border: "none" }}
                                    >
                                        <BsTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Alt kısım - Fiyat özeti ve buton */}
                        <div className="border-top p-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Alt Toplam {cart.length > 1 ? `(${cart.length} ürün)` : ''}</span>
                                <span>{totalPrice.toFixed(2)} TL</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Kargo</span>
                                <span>{shippingCost.toFixed(2)} TL</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold mb-3">
                                <span>Toplam</span>
                                <span>{finalTotal.toFixed(2)} TL</span>
                            </div>

                            <button
                                className="btn btn-dark w-100 py-2 mb-2"
                                onClick={() => {
                                    setIsCartOpen(false);
                                    window.location.href = '/payment';
                                }}
                            >
                                ÖDEMEYE GEÇ
                            </button>

                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setIsCartOpen(false)}
                            >
                                ALIŞVERİŞE DEVAM ET
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Tam sayfa sepet görünümü (ana CartPage olarak kullanılır)
    return (
        <div className="container py-4">
            <h2 className="mb-4">Sepetiniz</h2>

            {cart.length === 0 ? (
                <div className="alert alert-info">
                    <p className="mb-0">Sepetiniz boş. Alışverişe devam etmek için <a href="/">buraya tıklayın</a>.</p>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-8">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="card mb-3">
                                <div className="card-body position-relative">
                                    <div className="d-flex">
                                        {/* Ürün Görseli */}
                                        <div className="me-3" style={{ width: "120px", height: "120px", minWidth: "120px" }}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center">
                                                    <span className="text-muted">Görsel yok</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Ürün Bilgileri */}
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1">{item.name}</h5>
                                            <p className="text-muted mb-2">
                                                {item.size} | {item.color}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <p className="fw-bold fs-5 mb-0">{item.price.toFixed(2)} TL</p>

                                                <div className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-3">{item.quantity}</span>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Silme butonu */}
                                    <button
                                        className="btn position-absolute top-0 end-0 p-2"
                                        onClick={() => handleRemove(item.id, item.size, item.color)}
                                        style={{ background: "none", border: "none" }}
                                    >
                                        <BsTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Sipariş Özeti</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Alt Toplam {cart.length > 1 ? `(${cart.length} ürün)` : ''}</span>
                                    <span>{totalPrice.toFixed(2)} TL</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Kargo</span>
                                    <span>{shippingCost.toFixed(2)} TL</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold mb-3">
                                    <span>Toplam</span>
                                    <span>{finalTotal.toFixed(2)} TL</span>
                                </div>

                                <button
                                    className="btn btn-dark w-100 py-2 mb-2"
                                    onClick={() => window.location.href = '/payment'}
                                >
                                    ÖDEMEYE GEÇ
                                </button>
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => window.location.href = '/'}
                                >
                                    ALIŞVERİŞE DEVAM ET
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;