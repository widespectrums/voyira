import { useApp } from "../context/AppContext.jsx";

const OrderPage = () => {
    const { cart } = useApp();
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = totalPrice > 0 ? 99.99 : 0;
    const finalTotal = totalPrice + shippingCost;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Siparişinizin Özeti</h2>
            {cart.length === 0 ? (
                <p>Sepetinizde ürün bulunmuyor.</p>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold">Sipariş Detayları</h3>
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between border-b py-4">
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p>Renk: {item.color}, Beden: {item.size}</p>
                                <p>Adet: {item.quantity}</p>
                            </div>
                            <p>{(item.price * item.quantity).toFixed(2)} TL</p>
                        </div>
                    ))}
                    <h3 className="text-xl font-semibold mt-4">Ürün Toplamı: {totalPrice.toFixed(2)} TL</h3>
                    <h3 className="text-xl font-semibold mt-2">Kargo Ücreti: {shippingCost.toFixed(2)} TL</h3>
                    <h3 className="text-xl font-bold mt-2">Genel Toplam: {finalTotal.toFixed(2)} TL</h3>
                    <p className="mt-4 text-lg">Siparişiniz başarıyla alınmıştır. Teşekkür ederiz!</p>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
