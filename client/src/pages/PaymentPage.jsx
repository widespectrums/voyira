import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const PaymentPage = () => {
    const { cart } = useApp();
    const [paymentMethod, setPaymentMethod] = useState("credit-card");
    const [address, setAddress] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const navigate = useNavigate();

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = totalPrice > 0 ? 99.99 : 0;
    const finalTotal = totalPrice + shippingCost;

    const handlePayment = () => {
        // Burada ödeme API entegrasyonu yapılacak
        // Eğer ödeme başarılıysa, ödeme sonrası kullanıcıyı sipariş sayfasına yönlendireceğiz
        alert("Ödeme işlemi başarıyla tamamlandı.");
        navigate("/orders");
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Ödeme Sayfası</h2>
            {cart.length === 0 ? (
                <p>Sepetinizde ürün bulunmuyor.</p>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold">Ödeme Bilgileri</h3>
                    <div className="mt-4">
                        <label className="block font-semibold">Teslimat Adresi</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border p-2 w-full"
                            placeholder="Adresinizi girin"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block font-semibold">Ödeme Yöntemi</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="border p-2 w-full"
                        >
                            <option value="credit-card">Kredi Kartı</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>

                    {paymentMethod === "credit-card" && (
                        <div className="mt-4">
                            <label className="block font-semibold">Kart Numarası</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="border p-2 w-full"
                                placeholder="Kart numaranızı girin"
                            />
                        </div>
                    )}

                    {paymentMethod === "credit-card" && (
                        <div className="mt-4 flex">
                            <div className="w-1/2 pr-2">
                                <label className="block font-semibold">Son Kullanma Tarihi</label>
                                <input
                                    type="text"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="border p-2 w-full"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block font-semibold">CVV</label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="border p-2 w-full"
                                    placeholder="CVV"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Ödenecek Tutar</h3>
                        <p>Ürün Toplamı: {totalPrice.toFixed(2)} TL</p>
                        <p>Kargo Ücreti: {shippingCost.toFixed(2)} TL</p>
                        <h3 className="text-xl font-bold">Genel Toplam: {finalTotal.toFixed(2)} TL</h3>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md"
                    >
                        Ödemeyi Tamamla
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
