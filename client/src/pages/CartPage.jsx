import { useApp } from "../context/AppContext.jsx"; // Use the correct hook here

const CartPage = () => {
    const { cart } = useApp(); // Use the useApp hook to access the cart

    if (!cart) return <div>Loading...</div>;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = totalPrice > 0 ? 99.99 : 0; // Kargo ücreti
    const finalTotal = totalPrice + shippingCost;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Sepetiniz</h2>
            {cart.length === 0 ? (
                <p>Sepetiniz boş.</p>
            ) : (
                <div>
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
                    <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md">
                        Ödeme Yap
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
